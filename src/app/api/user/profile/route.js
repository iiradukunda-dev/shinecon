import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { userId, action } = data;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (action === 'change_password') {
      const { currentPassword, newPassword } = data;
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { success: false, error: 'Both current and new password are required' },
          { status: 400 },
        );
      }

      if (user.passwordHash !== hashPassword(currentPassword)) {
        return NextResponse.json(
          { success: false, error: 'Incorrect current password' },
          { status: 401 },
        );
      }

      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: hashPassword(newPassword) },
      });

      return NextResponse.json({ success: true, message: 'Password updated successfully' });
    }

    if (action === 'update_photo') {
      const { photoUrl } = data;
      if (!photoUrl) {
        return NextResponse.json(
          { success: false, error: 'Photo data is required' },
          { status: 400 },
        );
      }

      // If the user has a MemberProfile, update it. If not (e.g. Admin without profile), create it.
      if (user.profile) {
        await prisma.memberProfile.update({
          where: { userId: user.id },
          data: { photoUrl },
        });
      } else {
        await prisma.memberProfile.create({
          data: {
            userId: user.id,
            fullName: 'System Admin',
            phone: '',
            photoUrl,
            memberType: 'LOCAL',
            employment: 'EMPLOYED',
            approvalStatus: 'APPROVED',
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Profile photo updated successfully',
        photoUrl,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
