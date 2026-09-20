import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { generateSecureToken, hashToken } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/email';
import { createRateLimiter, isValidEmail, normalizeEmail } from '@/lib/security';

const resendVerificationLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 5 });

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!resendVerificationLimiter(clientIp, 'resend-verification')) {
      return NextResponse.json({ error: 'Too many verification emails. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const email = normalizeEmail(body.email);

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'If an account exists, a verification email has been sent.' }, { status: 200 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: 'Email already verified' }, { status: 200 });
    }

    // Rate limiting: max 5 attempts per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (user.lastVerificationSent && user.lastVerificationSent > oneHourAgo && user.verificationAttempts >= 5) {
      return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
    }

    const verificationToken = generateSecureToken();
    const hashedVerificationToken = hashToken(verificationToken);
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = hashedVerificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    user.lastVerificationSent = new Date();
    user.verificationAttempts = (user.verificationAttempts || 0) + 1;
    await user.save();

    await sendVerificationEmail(email, user.fullName, verificationToken);

    return NextResponse.json({ message: 'Verification email sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
