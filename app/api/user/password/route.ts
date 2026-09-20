import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import bcrypt from 'bcryptjs';
import { createRateLimiter } from '@/lib/security';

const passwordUpdateLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 10 });

export async function PUT(request: Request) {
  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!passwordUpdateLimiter(clientIp, 'password-update')) {
      return NextResponse.json({ error: 'Too many password update attempts. Please try again later.' }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { currentPassword, newPassword, confirmPassword, setPassword } = await request.json();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Handle setting password for first time (Google users)
    if (setPassword) {
      if (!newPassword || !confirmPassword) {
        return NextResponse.json({ error: 'Please fill all fields' }, { status: 400 });
      }
      if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      await user.save();

      return NextResponse.json({ success: true, message: 'Password set successfully' });
    }

    // Handle changing password (email users)
    if (user.provider !== 'email') {
      return NextResponse.json({ error: 'This account uses Google Sign-In. Password changes are managed through your Google Account.' }, { status: 400 });
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'Please fill all fields' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password!);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('[Password Update Error]', error);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
