import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';

// Debug function for consistent logging
const debug = (message: string, ...data: any[]) => {
  console.log(`[NextAuth] ${message}`, ...data.map(d => 
    typeof d === 'object' ? JSON.stringify(d, null, 2) : d
  ));
};

export const authOptions: NextAuthOptions = {
  debug: true, // Enable NextAuth debug mode
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

        try {
          await dbConnect();
          debug('Connected to MongoDB');

          const user = await User.findOne({ email: credentials.email });
          debug('Found user:', user);

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
          debug('Processing Google sign-in for:', profile.email);

          const existingUser = await User.findOne({ email: profile.email });
          debug('Existing user found:', existingUser ? 'Yes' : 'No');

          if (!existingUser) {
            debug('Creating new user');
            const newUser = await User.create({
              fullName: profile.name || '',
              email: profile.email,
              profilePicture: profile.image,
              provider: 'google',
              emailVerified: true,
              lastLogin: new Date(),
            });
            debug('New user created with createdAt:', newUser.createdAt, 'lastLogin:', newUser.lastLogin);
          } else {
            debug('Updating existing user');
            existingUser.lastLogin = new Date();
            existingUser.profilePicture = profile.image || existingUser.profilePicture;
            existingUser.fullName = profile.name || existingUser.fullName;
            await existingUser.save();
            debug('User updated with lastLogin:', existingUser.lastLogin);
          }
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
          const dbUser = await User.findById(token.sub);
          debug('DB User found:', dbUser);
          
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            session.user.name = dbUser.fullName;
            session.user.email = dbUser.email;
            session.user.image = dbUser.profilePicture;
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
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
