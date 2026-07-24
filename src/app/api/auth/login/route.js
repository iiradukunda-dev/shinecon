import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (email === 'admin@smconnect.org') {
      const adminHash = hashPassword('admin123');
      if (hashPassword(password) === adminHash) {
        return NextResponse.json({
          success: true,
          role: 'admin',
          user: { id: '0', name: 'Super Admin', email, role: 'admin', photo: null },
        });
      } else {
        return NextResponse.json({ success: false, error: 'Invalid admin password' }, { status: 401 });
      }
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User account not found' }, { status: 404 });
    }

    if (user.passwordHash !== hashPassword(password)) {
      return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
    }

    if (user.profile?.approvalStatus !== 'APPROVED') {
      return NextResponse.json({ success: false, error: 'Account is pending approval or suspended' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      role: 'member',
      user: {
        id: user.id,
        name: user.profile.fullName,
        email: user.email,
        phone: user.profile.phone,
        country: user.profile.country,
        photo: user.profile.photoUrl,
        type: user.profile.memberType.toLowerCase(),
        employment: user.profile.employment.toLowerCase(),
        status: user.profile.approvalStatus.toLowerCase(),
        joinedDate: user.profile.joinedDate ? new Date(user.profile.joinedDate).toISOString().split('T')[0] : '',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
