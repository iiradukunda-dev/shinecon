import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashPassword(data.password || 'changeme123'),
        role: 'MEMBER',
        profile: {
          create: {
            fullName: data.name,
            phone: data.phone,
            country: data.country,
            memberType: (data.type || 'local').toUpperCase(),
            employment: (data.employment || 'employed').toUpperCase(),
            approvalStatus: 'PENDING',
          },
        },
      },
      include: { profile: true },
    });

    return NextResponse.json({
      id: user.id,
      name: user.profile.fullName,
      email: user.email,
      phone: user.profile.phone,
      country: user.profile.country,
      type: user.profile.memberType.toLowerCase(),
      employment: user.profile.employment.toLowerCase(),
      status: user.profile.approvalStatus.toLowerCase(),
      joinedDate: new Date().toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('Failed to create member:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();
    
    const updateData = {};
    if (data.name) updateData.fullName = data.name;
    if (data.phone) updateData.phone = data.phone;
    if (data.country) updateData.country = data.country;
    if (data.type) updateData.memberType = data.type.toUpperCase();
    if (data.employment) updateData.employment = data.employment.toUpperCase();
    if (data.status) updateData.approvalStatus = data.status.toUpperCase();

    const profile = await prisma.memberProfile.update({
      where: { userId: id },
      data: updateData,
      include: { user: true },
    });

    return NextResponse.json({
      id: profile.userId,
      name: profile.fullName,
      email: profile.user.email,
      phone: profile.phone,
      country: profile.country,
      type: profile.memberType.toLowerCase(),
      employment: profile.employment.toLowerCase(),
      status: profile.approvalStatus.toLowerCase(),
    });
  } catch (error) {
    console.error('Failed to update member:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const contributions = await prisma.contribution.findMany({ where: { userId: id }, select: { id: true } });
    const contributionIds = contributions.map(c => c.id);

    const aiConversations = await prisma.aIConversation.findMany({ where: { userId: id }, select: { id: true } });
    const aiConversationIds = aiConversations.map(c => c.id);

    await prisma.$transaction([
      prisma.payment.deleteMany({ where: { contributionId: { in: contributionIds } } }),
      prisma.aIMessage.deleteMany({ where: { conversationId: { in: aiConversationIds } } }),
      prisma.contribution.deleteMany({ where: { userId: id } }),
      prisma.campaignDonation.deleteMany({ where: { userId: id } }),
      prisma.attendanceRecord.deleteMany({ where: { userId: id } }),
      prisma.message.deleteMany({ where: { senderId: id } }),
      prisma.aIConversation.deleteMany({ where: { userId: id } }),
      prisma.notification.deleteMany({ where: { userId: id } }),
      prisma.session.deleteMany({ where: { userId: id } }),
      prisma.passwordReset.deleteMany({ where: { userId: id } }),
      prisma.auditLog.deleteMany({ where: { userId: id } }),
      prisma.memberProfile.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete member:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
