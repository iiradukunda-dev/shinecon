import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;
    const email = body.email?.toLowerCase();


    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User account not found. Please check the email again.' }, { status: 404 });
    }

    if (user.passwordHash !== hashPassword(password)) {
      return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
    }

    if (!user.emailVerified) {
      return NextResponse.json({ success: false, error: 'Please verify your Gmail account before logging in.' }, { status: 403 });
    }

    if (user.role !== 'SUPER_ADMIN' && user.profile?.approvalStatus !== 'APPROVED') {
      return NextResponse.json({ success: false, error: 'Account is pending approval or suspended' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      role: user.role === 'SUPER_ADMIN' ? 'admin' : 'member',
      user: {
        id: user.id,
        role: user.role === 'SUPER_ADMIN' ? 'admin' : 'member',
        name: user.profile?.fullName || 'System Admin',
        email: user.email,
        phone: user.profile?.phone || '',
        country: user.profile?.country || '',
        photo: user.profile?.photoUrl || null,
        type: user.profile?.memberType?.toLowerCase() || 'local',
        employment: user.profile?.employment?.toLowerCase() || 'employed',
        status: user.profile?.approvalStatus?.toLowerCase() || 'approved',
        joinedDate: user.profile?.joinedDate ? new Date(user.profile.joinedDate).toISOString().split('T')[0] : '',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
