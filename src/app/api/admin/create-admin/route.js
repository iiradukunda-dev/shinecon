import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(req) {
  try {
    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return NextResponse.json({ success: false, error: 'Only official @gmail.com accounts are allowed for admin access.' }, { status: 400 });
    }

    // Check for duplicate
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'An account with this email already exists.' }, { status: 400 });
    }

    // Create the admin user
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash: hashPassword(password),
        role: 'SUPER_ADMIN', // using SUPER_ADMIN or MEMBER per schema
        emailVerified: false,
        profile: {
          create: {
            fullName: fullName,
            phone: 'N/A', // defaults
            country: 'N/A', // defaults
            memberType: 'LOCAL',
            employment: 'EMPLOYED',
            approvalStatus: 'APPROVED'
          }
        },
        emailVerifications: {
          create: {
            token: crypto.randomBytes(32).toString('hex'),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
          }
        }
      },
      include: {
        emailVerifications: true
      }
    });

    const verification = newUser.emailVerifications[0];
    await sendVerificationEmail(newUser.email, verification.token);

    return NextResponse.json({ success: true, message: 'Admin account created. Verification email sent.' });
  } catch (error) {
    console.error('Failed to create alternative admin account:', error);
    return NextResponse.json({ success: false, error: 'Server error while creating admin account.' }, { status: 500 });
  }
}
