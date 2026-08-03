import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Members
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        profile: {
          select: {
            fullName: true,
            phone: true,
            country: true,
            photoUrl: true,
            memberType: true,
            employment: true,
            approvalStatus: true,
            joinedDate: true,
          }
        }
      },
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
      select: {
        id: true,
        userId: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
        user: { select: { profile: { select: { fullName: true, phone: true } } } },
        contributionType: { select: { name: true } },
        payment: { select: { transactionRef: true, phone: true } },
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
      select: {
        id: true,
        title: true,
        description: true,
        goal: true,
        raised: true,
        currency: true,
        startDate: true,
        endDate: true,
        status: true,
        featured: true,
        imageUrl: true,
        donations: { select: { id: true } },
      },
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
      image: camp.imageUrl || 'church',
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
      icon: t.icon || 'wallet',
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
    const dbAnnouncements = await prisma.announcement.findMany({
      orderBy: { publishDate: 'desc' },
    });
    const announcements = dbAnnouncements.map(a => ({
      id: a.id,
      title: a.title,
      category: a.category,
      priority: a.priority,
      date: a.publishDate ? new Date(a.publishDate).toISOString().split('T')[0] : '',
      description: a.description,
      image: a.imageUrl || 'megaphone',
    }));

    // 7. Attendance
    const dbAttendance = await prisma.attendanceEvent.findMany({
      select: {
        id: true,
        title: true,
        startTime: true,
        gpsRadius: true,
        qrCode: true,
        records: {
          select: {
            user: { select: { email: true, profile: { select: { fullName: true } } } }
          }
        }
      },
    });
    const attendance = dbAttendance.map(att => ({
      id: att.id,
      event: att.title,
      date: att.startTime ? new Date(att.startTime).toISOString().split('T')[0] : '',
      total: att.records.length,
      capacity: att.gpsRadius || 250,
      qrCode: att.qrCode,
      attendees: att.records.map(r => r.user.profile?.fullName || r.user.email),
    }));

    // 8. Messages
    const dbMessages = await prisma.message.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        read: true,
        sender: { select: { profile: { select: { fullName: true } } } },
        conversation: { select: { subject: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to last 100 messages for performance
    });
    const messages = dbMessages.map(m => ({
      id: m.id,
      from: m.sender.profile?.fullName || 'Anonymous',
      subject: m.conversation.subject,
      lastMessage: m.content,
      date: m.createdAt ? new Date(m.createdAt).toISOString().split('T')[0] : '',
      unread: !m.read,
    }));

    // 9. Notifications
    const dbNotifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    const notifications = dbNotifications.map(n => ({
      id: n.id,
      userId: n.userId,
      title: n.title,
      message: n.body,
      type: n.type,
      unread: !n.read,
      time: n.createdAt ? new Date(n.createdAt).toISOString() : '',
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
      notifications,
    });
  } catch (error) {
    console.error('Failed to bootstrap application:', error);
    return NextResponse.json({ error: 'Failed to bootstrap data', details: error.message, stack: error.stack }, { status: 500 });
  }
}
