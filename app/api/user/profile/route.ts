import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';

export async function PUT(request: Request) {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { fullName, username, bio, profilePicture } = await request.json();
    const profileImage = typeof profilePicture === 'string' && /^https?:\/\//i.test(profilePicture)
      ? profilePicture
      : undefined;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        fullName: fullName || session.user.name,
        username: username || undefined,
        bio: bio || undefined,
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
