import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { hashToken } from '@/lib/token';
import { createRateLimiter } from '@/lib/security';

const resetPasswordLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 5 });

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!resetPasswordLimiter(clientIp, 'reset-password')) {
      return NextResponse.json({ error: 'Too many password reset attempts. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const token = typeof body.token === 'string' ? body.token.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    await dbConnect();
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    const isSamePassword = user.password ? await bcrypt.compare(password, user.password) : false;
    if (isSamePassword) {
      return NextResponse.json({ error: 'New password must be different from your current password' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    user.resetAttempts = 0;
    await user.save();

    return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
