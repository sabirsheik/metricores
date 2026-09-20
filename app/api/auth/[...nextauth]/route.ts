import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { normalizeEmail } from '@/lib/security';

const debug = (message: string, ...data: unknown[]) => {
  if (process.env.NODE_ENV !== 'development') return;

  const sanitized = data.map((entry) => {
    if (!entry || typeof entry !== 'object') return entry;
    if (entry instanceof Error) return { name: entry.name, message: entry.message };

    const obj = entry as Record<string, unknown>;
    const redacted: Record<string, unknown> = { ...obj };

    for (const key of ['password', 'token', 'secret', 'authorization', 'email']) {
      if (typeof redacted[key] === 'string') {
        redacted[key] = '[redacted]';
      }
    }

    return redacted;
  });

  console.log(`[NextAuth] ${message}`, ...sanitized);
};

function getProviderImage(profile: any, user: any): string | undefined {
  const image = profile?.picture || profile?.image || user?.image;
  return typeof image === 'string' && /^https?:\/\//i.test(image) ? image : undefined;
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        debug('Credentials authorize called with', credentials);
        
        if (!credentials?.email || !credentials?.password) {
          debug('Missing email or password');
          return null;
        }

        const normalizedEmail = normalizeEmail(credentials.email);
        if (!normalizedEmail) {
          debug('Invalid email in credentials authorize');
          return null;
        }

        try {
          await dbConnect();
          debug('Connected to MongoDB');

          const user = await User.findOne({ email: normalizedEmail });
          debug('Found user:', user ? 'Yes' : 'No');

          if (!user || !user.password) {
            debug('User not found or no password');
            return null;
          }

          if (!user.emailVerified) {
            debug('Email not verified');
            // Return a user object with a flag so the signIn callback can handle it
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.fullName,
              image: user.profilePicture,
              emailVerified: false,
              _emailNotVerified: true,
            } as any;
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          debug('Password correct:', isPasswordCorrect);

          if (!isPasswordCorrect) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.fullName,
            image: user.profilePicture,
            emailVerified: true,
          };
        } catch (error) {
          debug('Error in credentials authorize:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      debug('=== signIn callback ===');
      debug('User:', user);
      debug('Account:', account);
      debug('Profile:', profile);

      try {
        await dbConnect();
        debug('Connected to MongoDB for signIn');

        if (account?.provider === 'google' && profile) {
          const normalizedGoogleEmail = normalizeEmail(profile.email);
          debug('Processing Google sign-in for:', normalizedGoogleEmail);
          const providerImage = getProviderImage(profile, user);

          const existingUser = await User.findOne({ email: normalizedGoogleEmail });
          debug('Existing user found:', existingUser ? 'Yes' : 'No');

          let googleUser = existingUser;
          if (!googleUser) {
            debug('Creating new user');
            googleUser = await User.create({
              fullName: profile.name || '',
              email: profile.email,
              profilePicture: providerImage || '',
              provider: 'google',
              emailVerified: true,
              lastLogin: new Date(),
            });
            debug('New user created with createdAt:', googleUser.createdAt, 'lastLogin:', googleUser.lastLogin);
          } else {
            debug('Updating existing user');
            googleUser.lastLogin = new Date();
            if (providerImage) googleUser.profilePicture = providerImage;
            googleUser.fullName = profile.name || googleUser.fullName;
            await googleUser.save();
            debug('User updated with lastLogin:', googleUser.lastLogin);
          }
          user.id = googleUser._id.toString();
        } else if (account?.provider === 'credentials') {
          debug('Processing credentials sign-in for:', user.id);
          const existingUser = await User.findById(user.id);
          if (!existingUser) {
            debug('No user found for credentials sign-in');
            return false;
          }
          existingUser.lastLogin = new Date();
          await existingUser.save();
          debug('Credentials user login updated');
        }
        
        debug('signIn returning true');
        return true;
      } catch (error) {
        debug('ERROR in signIn callback:', error);
        return false;
      }
    },
    async session({ session, token }) {
      debug('=== session callback ===');
      debug('Session before:', session);
      debug('Token:', token);

      try {
        if (session.user && token.sub) {
          await dbConnect();
          const dbUser = /^[0-9a-fA-F]{24}$/.test(token.sub)
            ? await User.findById(token.sub)
            : token.email
              ? await User.findOne({ email: token.email })
              : null;
          debug('DB User found:', dbUser);
          
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            session.user.name = dbUser.fullName;
            session.user.email = dbUser.email;
            session.user.image = dbUser.profilePicture || token.picture || null;
            // Add custom fields to session - explicitly convert to Date objects
            (session.user as any).provider = dbUser.provider;
            (session.user as any).createdAt = dbUser.createdAt ? new Date(dbUser.createdAt).toISOString() : null;
            (session.user as any).lastLogin = dbUser.lastLogin ? new Date(dbUser.lastLogin).toISOString() : null;
            (session.user as any).emailVerified = dbUser.emailVerified;
            
            debug('Added to session:', {
              provider: (session.user as any).provider,
              createdAt: (session.user as any).createdAt,
              lastLogin: (session.user as any).lastLogin,
            });
          }
        }
        
        debug('Session after:', session);
        return session;
      } catch (error) {
        debug('ERROR in session callback:', error);
        return session;
      }
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      debug('=== jwt callback ===');
      debug('Token:', token);
      debug('User:', user);
      debug('Account:', account);
      debug('Profile:', profile);
      debug('Is new user:', isNewUser);
      
      if (user) {
        token.sub = user.id;
      }
      
      debug('Final token:', token);
      return token;
    },
    async redirect({ url, baseUrl }) {
      debug('=== redirect callback ===');
      debug('URL:', url);
      debug('Base URL:', baseUrl);
      
      // If url is relative (starts with /), just return baseUrl + url without parsing
      if (url && url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Only try to parse as full URL if it's not relative
      try {
        if (url) {
          const parsedUrl = new URL(url, baseUrl);
          const baseOrigin = new URL(baseUrl).origin;
          if (parsedUrl.origin === baseOrigin) {
            return parsedUrl.toString();
          }
        }
      } catch (error) {
        debug('Error parsing URL in redirect callback, using default:', error);
      }
      
      // Default fallback
      return baseUrl + '/profile';
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-only-secret-change-me',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
