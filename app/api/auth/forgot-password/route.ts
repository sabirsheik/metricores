import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { generateSecureToken, hashToken } from '@/lib/token';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user || !user.emailVerified || user.provider !== 'email') {
      return NextResponse.json({ message: 'If an account exists, a password reset email has been sent.' }, { status: 200 });
    }

    // Rate limiting: max 5 attempts per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (user.lastResetSent && user.lastResetSent > oneHourAgo && user.resetAttempts >= 5) {
      return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
    }

    const resetToken = generateSecureToken();
    const hashedResetToken = hashToken(resetToken);
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordTokenExpires = resetTokenExpires;
    user.lastResetSent = new Date();
    user.resetAttempts = (user.resetAttempts || 0) + 1;
    await user.save();

    await sendPasswordResetEmail(email, user.fullName, resetToken);

    return NextResponse.json({ message: 'Password reset email sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
