import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { hashToken } from '@/lib/token';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/auth?error=invalid-token', request.url));
    }

    await dbConnect();
    const tokenCandidates = [token, hashToken(token)];

    const user = await User.findOne({
      verificationToken: { $in: tokenCandidates },
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
