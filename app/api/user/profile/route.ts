import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { sanitizeText, normalizeEmail } from '@/lib/security';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const fullName = sanitizeText(body.fullName, 80) || session.user.name || 'User';
    const username = typeof body.username === 'string' ? sanitizeText(body.username, 30) || undefined : undefined;
    const bio = typeof body.bio === 'string' ? sanitizeText(body.bio, 500) || undefined : undefined;
    const profileImage = typeof body.profilePicture === 'string' && /^https?:\/\//i.test(body.profilePicture)
      ? body.profilePicture
      : undefined;

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        fullName,
        username,
        bio,
        ...(profileImage ? { profilePicture: profileImage } : {}),
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: updatedUser._id.toString(),
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        bio: updatedUser.bio,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        provider: updatedUser.provider,
        emailVerified: updatedUser.emailVerified,
        createdAt: updatedUser.createdAt,
        lastLogin: updatedUser.lastLogin,
      },
    });
  } catch (error) {
    console.error('[Profile Update Error]', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
