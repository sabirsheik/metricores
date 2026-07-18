import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: 'email' | 'google';
      createdAt?: Date;
      lastLogin?: Date;
      emailVerified?: boolean;
    };
  }
}
