import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { generateSecureToken, hashToken } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/email';
import { createRateLimiter, isValidEmail, normalizeEmail, sanitizeText } from '@/lib/security';
import { validatePassword } from '@/utils/password';

const signupLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 5 });

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!signupLimiter(clientIp, 'signup')) {
      return NextResponse.json({ error: 'Too many signup attempts. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const fullName = sanitizeText(body.fullName, 80);
    const email = normalizeEmail(body.email);
    const password = typeof body.password === 'string' ? body.password : '';

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateSecureToken();
    const hashedVerificationToken = hashToken(verificationToken);
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      provider: 'email',
      verificationToken: hashedVerificationToken,
      verificationTokenExpires,
      lastVerificationSent: new Date(),
    });

    await sendVerificationEmail(email, fullName, verificationToken);

    return NextResponse.json(
      { 
        message: 'User created successfully. Please check your email to verify your account.', 
        user: { id: user._id, fullName, email } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
