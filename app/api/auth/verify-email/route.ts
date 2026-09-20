import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { hashToken } from '@/lib/token';
import { createRateLimiter } from '@/lib/security';

const verifyEmailLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 20 });

export async function GET(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!verifyEmailLimiter(clientIp, 'verify-email')) {
      return NextResponse.redirect(new URL('/auth?error=rate-limited', request.url));
    }

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/auth?error=invalid-token', request.url));
    }

    await dbConnect();
    const user = await User.findOne({
      verificationToken: hashToken(token),
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.redirect(new URL('/auth?error=invalid-token', request.url));
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    user.verificationAttempts = 0;
    await user.save();

    return NextResponse.redirect(new URL('/auth?verified=true', request.url));
  } catch (error: any) {
    console.error('Verify email error:', error);
    return NextResponse.redirect(new URL('/auth?error=verify-failed', request.url));
  }
}
