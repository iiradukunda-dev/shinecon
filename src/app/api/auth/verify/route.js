import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 });
  }

  try {
    const verification = await prisma.emailVerification.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!verification) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 400 });
    }

    if (verification.expiresAt < new Date()) {
      await prisma.emailVerification.delete({ where: { id: verification.id } });
      return NextResponse.json({ success: false, error: 'Token has expired. Please register again.' }, { status: 400 });
    }

    // Verify user and delete token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: verification.userId },
        data: { emailVerified: true }
      }),
      prisma.emailVerification.delete({
        where: { id: verification.id }
      })
    ]);

    // Redirect to login with success message
    return NextResponse.redirect(new URL('/login?verified=true', request.url));
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
