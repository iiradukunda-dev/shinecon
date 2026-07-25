import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Members
    const users = await prisma.user.findMany({
      include: { profile: true },
    });
    const members = users
      .filter(u => u.role === 'MEMBER')
      .map(u => ({
        id: u.id,
        name: u.profile?.fullName || '',
        email: u.email,
        phone: u.profile?.phone || '',
        country: u.profile?.country || '',
        photo: u.profile?.photoUrl || null,
        type: u.profile?.memberType?.toLowerCase() || 'local',
        employment: u.profile?.employment?.toLowerCase() || 'employed',
        status: u.profile?.approvalStatus?.toLowerCase() || 'pending',
        joinedDate: u.profile?.joinedDate ? new Date(u.profile.joinedDate).toISOString().split('T')[0] : '',
        lastLogin: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '',
      }));

    // 2. Contributions
    const dbContributions = await prisma.contribution.findMany({
      include: {
        user: { include: { profile: true } },
        contributionType: true,
        payment: true,
      },
    });
    const contributions = dbContributions.map(c => ({
      id: c.id,
      memberId: c.userId,
      memberName: c.user.profile?.fullName || 'Unknown Member',
      type: c.contributionType.name,
      amount: Number(c.amount),
      currency: c.currency,
      reference: c.payment?.transactionRef || '',
      status: c.status.toLowerCase(),
      date: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : '',
      phone: c.payment?.phone || c.user.profile?.phone || '',
    }));

    // 3. Campaigns
    const dbCampaigns = await prisma.campaign.findMany({
      include: { donations: true },
    });
    const campaigns = dbCampaigns.map(camp => ({
      id: camp.id,
      title: camp.title,
      description: camp.description,
      goal: Number(camp.goal),
      raised: Number(camp.raised),
      currency: camp.currency,
      startDate: camp.startDate ? new Date(camp.startDate).toISOString().split('T')[0] : '',
      endDate: camp.endDate ? new Date(camp.endDate).toISOString().split('T')[0] : '',
      status: camp.status.toLowerCase(),
      featured: camp.featured,
      contributors: camp.donations.length,
      image: camp.imageUrl || '🏛️',
    }));

    // 4. Contribution Types
    const dbTypes = await prisma.contributionType.findMany();
    const contributionTypes = dbTypes.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description || '',
      category: t.category,
      localStudent: Number(t.localStudentAmt),
      localEmployed: Number(t.localEmployedAmt),
      diasporaStudent: Number(t.diasporaStudentAmt),
      diasporaEmployed: Number(t.diasporaEmployedAmt),
      currency: t.currency,
      recurring: t.recurring,
      active: t.active,
      icon: t.icon || '💰',
      color: t.color || '#D4A843',
    }));

    // 5. Events
    const dbEvents = await prisma.calendarEvent.findMany();
    const events = dbEvents.map(e => ({
      id: e.id,
      title: e.title,
      date: e.startTime ? new Date(e.startTime).toISOString().split('T')[0] : '',
      time: e.startTime ? new Date(e.startTime).toISOString().split('T')[1].substring(0, 5) : '',
      location: e.location || '',
      category: e.category,
      recurring: e.recurring,
      description: e.description || '',
    }));

    // 6. Announcements
    const dbAnnouncements = await prisma.announcement.findMany();
    const announcements = dbAnnouncements.map(a => ({
      id: a.id,
      title: a.title,
      category: a.category,
      priority: a.priority,
      date: a.publishDate ? new Date(a.publishDate).toISOString().split('T')[0] : '',
      description: a.description,
      image: a.imageUrl || '📣',
    }));

    // 7. Attendance
    const dbAttendance = await prisma.attendanceEvent.findMany({
      include: { records: true },
    });
    const attendance = dbAttendance.map(att => ({
      id: att.id,
      event: att.title,
      date: att.startTime ? new Date(att.startTime).toISOString().split('T')[0] : '',
      total: att.records.length || 187,
      capacity: 250,
      qrCode: att.qrCode,
    }));

    // 8. Messages
    const dbMessages = await prisma.message.findMany({
      include: {
        sender: { include: { profile: true } },
        conversation: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    const messages = dbMessages.map(m => ({
      id: m.id,
      from: m.sender.profile?.fullName || 'Anonymous',
      subject: m.conversation.subject,
      lastMessage: m.content,
      date: m.createdAt ? new Date(m.createdAt).toISOString().split('T')[0] : '',
      unread: !m.read,
    }));

    return NextResponse.json({
      members,
      contributions,
      campaigns,
      contributionTypes,
      events,
      announcements,
      attendance,
      messages,
    });
  } catch (error) {
    console.error('Failed to bootstrap application:', error);
    return NextResponse.json({ error: 'Failed to bootstrap data', details: error.message, stack: error.stack }, { status: 500 });
  }
}
