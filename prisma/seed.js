require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Cleaning database...');
  // Delete in reverse order of dependencies
  await prisma.auditLog.deleteMany({});
  await prisma.backupRecord.deleteMany({});
  await prisma.systemSetting.deleteMany({});
  await prisma.feedback.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.aIMessage.deleteMany({});
  await prisma.aIConversation.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.calendarEvent.deleteMany({});
  await prisma.attendanceRecord.deleteMany({});
  await prisma.attendanceEvent.deleteMany({});
  await prisma.campaignDonation.deleteMany({});
  await prisma.campaignImage.deleteMany({});
  await prisma.campaign.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.contribution.deleteMany({});
  await prisma.contributionType.deleteMany({});
  await prisma.memberProfile.deleteMany({});
  await prisma.passwordReset.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding users and member profiles...');
  
  // 1. Super Admin User
  const adminUser = await prisma.user.create({
    data: {
      id: '0',
      email: 'admin@smconnect.org',
      passwordHash: hashPassword('admin123'),
      role: 'SUPER_ADMIN',
    }
  });

  // 2. Demo Members
  const DEMO_MEMBERS = [
    { id: '1', name: 'Jean-Pierre Habimana', email: 'jp.habimana@email.com', phone: '+250 788 123 456', country: 'Rwanda', type: 'LOCAL', employment: 'EMPLOYED', status: 'APPROVED', joinedDate: '2024-01-15' },
    { id: '2', name: 'Marie Claire Uwimana', email: 'mc.uwimana@email.com', phone: '+250 788 234 567', country: 'Rwanda', type: 'LOCAL', employment: 'STUDENT', status: 'APPROVED', joinedDate: '2024-02-20' },
    { id: '3', name: 'Emmanuel Nsengiyumva', email: 'e.nsengiyumva@email.com', phone: '+250 788 345 678', country: 'Rwanda', type: 'LOCAL', employment: 'EMPLOYED', status: 'APPROVED', joinedDate: '2024-03-10' },
    { id: '4', name: 'Grace Mukamana', email: 'g.mukamana@email.com', phone: '+32 489 123 456', country: 'Belgium', type: 'DIASPORA', employment: 'EMPLOYED', status: 'APPROVED', joinedDate: '2024-04-05' },
    { id: '5', name: 'Patrick Niyonzima', email: 'p.niyonzima@email.com', phone: '+1 647 890 1234', country: 'Canada', type: 'DIASPORA', employment: 'EMPLOYED', status: 'APPROVED', joinedDate: '2024-05-12' },
    { id: '6', name: 'Diane Ingabire', email: 'd.ingabire@email.com', phone: '+250 788 456 789', country: 'Rwanda', type: 'LOCAL', employment: 'STUDENT', status: 'APPROVED', joinedDate: '2024-06-01' },
    { id: '7', name: 'Samuel Bizimana', email: 's.bizimana@email.com', phone: '+44 7700 900123', country: 'United Kingdom', type: 'DIASPORA', employment: 'EMPLOYED', status: 'APPROVED', joinedDate: '2024-06-15' },
    { id: '8', name: 'Claudine Nyiraneza', email: 'c.nyiraneza@email.com', phone: '+250 788 567 890', country: 'Rwanda', type: 'LOCAL', employment: 'EMPLOYED', status: 'PENDING', joinedDate: '2026-07-18' },
    { id: '9', name: 'David Mugabo', email: 'd.mugabo@email.com', phone: '+250 788 678 901', country: 'Rwanda', type: 'LOCAL', employment: 'EMPLOYED', status: 'APPROVED', joinedDate: '2024-07-20' },
    { id: '10', name: 'Esperance Mutoni', email: 'e.mutoni@email.com', phone: '+49 170 1234567', country: 'Germany', type: 'DIASPORA', employment: 'STUDENT', status: 'APPROVED', joinedDate: '2024-08-10' },
    { id: '11', name: 'Innocent Hakizimana', email: 'i.hakizimana@email.com', phone: '+250 788 789 012', country: 'Rwanda', type: 'LOCAL', employment: 'STUDENT', status: 'APPROVED', joinedDate: '2024-09-01' },
    { id: '12', name: 'Jeannette Umutoni', email: 'j.umutoni@email.com', phone: '+250 788 890 123', country: 'Rwanda', type: 'LOCAL', employment: 'EMPLOYED', status: 'APPROVED', joinedDate: '2024-09-15' },
    { id: '13', name: 'Thierry Ndayisaba', email: 't.ndayisaba@email.com', phone: '+33 6 12 34 56 78', country: 'France', type: 'DIASPORA', employment: 'EMPLOYED', status: 'PENDING', joinedDate: '2026-07-19' },
    { id: '14', name: 'Beatrice Uwase', email: 'b.uwase@email.com', phone: '+250 788 901 234', country: 'Rwanda', type: 'LOCAL', employment: 'EMPLOYED', status: 'APPROVED', joinedDate: '2024-10-20' },
    { id: '15', name: 'Olivier Nshimiyimana', email: 'o.nshimiyimana@email.com', phone: '+1 202 555 0143', country: 'United States', type: 'DIASPORA', employment: 'EMPLOYED', status: 'APPROVED', joinedDate: '2024-11-05' },
  ];

  for (const member of DEMO_MEMBERS) {
    const user = await prisma.user.create({
      data: {
        id: member.id,
        email: member.email,
        passwordHash: hashPassword('demo'),
        role: 'MEMBER',
      }
    });

    await prisma.memberProfile.create({
      data: {
        userId: user.id,
        fullName: member.name,
        phone: member.phone,
        country: member.country,
        memberType: member.type,
        employment: member.employment,
        approvalStatus: member.status,
        joinedDate: new Date(member.joinedDate),
      }
    });
  }

  console.log('Seeding contribution types...');
  const DEMO_CONTRIBUTION_TYPES = [
    { id: 'ct1', name: 'Monthly Contribution', description: 'Regular monthly contribution to support ministry operations', category: 'Regular', localStudentAmt: 2000, localEmployedAmt: 5000, diasporaStudentAmt: 10, diasporaEmployedAmt: 30, localCurrency: 'RWF', diasporaCurrency: 'USD', recurring: true, active: true, icon: '💰', color: '#D4A843' },
    { id: 'ct2', name: 'Building Fund', description: 'Contribution towards the new church building project', category: 'Project', localStudentAmt: 1000, localEmployedAmt: 3000, diasporaStudentAmt: 5, diasporaEmployedAmt: 20, localCurrency: 'RWF', diasporaCurrency: 'USD', recurring: true, active: true, icon: '🏗️', color: '#3B5BDB' },
    { id: 'ct3', name: 'Youth Ministry', description: 'Supporting youth programs and activities', category: 'Ministry', localStudentAmt: 500, localEmployedAmt: 2000, diasporaStudentAmt: 5, diasporaEmployedAmt: 15, localCurrency: 'RWF', diasporaCurrency: 'USD', recurring: false, active: true, icon: '🌟', color: '#2B8A3E' },
    { id: 'ct4', name: 'Choir Fund', description: 'Equipment, costumes, and choir event support', category: 'Ministry', localStudentAmt: 500, localEmployedAmt: 1500, diasporaStudentAmt: 3, diasporaEmployedAmt: 10, localCurrency: 'RWF', diasporaCurrency: 'USD', recurring: false, active: true, icon: '🎵', color: '#9C36B5' },
    { id: 'ct5', name: 'Mission Support', description: 'Funding missions and outreach programs', category: 'Mission', localStudentAmt: 1000, localEmployedAmt: 3000, diasporaStudentAmt: 10, diasporaEmployedAmt: 25, localCurrency: 'RWF', diasporaCurrency: 'USD', recurring: false, active: true, icon: '✈️', color: '#E8590C' },
    { id: 'ct6', name: 'Special Offering', description: 'Special seasonal or event-based offerings', category: 'Special', localStudentAmt: 0, localEmployedAmt: 0, diasporaStudentAmt: 0, diasporaEmployedAmt: 0, localCurrency: 'RWF', diasporaCurrency: 'USD', recurring: false, active: true, icon: '🎁', color: '#F59F00' },
  ];

  for (const type of DEMO_CONTRIBUTION_TYPES) {
    await prisma.contributionType.create({
      data: type
    });
  }

  console.log('Seeding contributions...');
  const DEMO_CONTRIBUTIONS = [
    { id: 'c1', userId: '1', contributionTypeId: 'ct1', amount: 5000, currency: 'RWF', reference: 'MTN-2026071501', status: 'APPROVED', date: '2026-07-15', phone: '+250 788 123 456' },
    { id: 'c2', userId: '2', contributionTypeId: 'ct1', amount: 2000, currency: 'RWF', reference: 'MTN-2026071502', status: 'APPROVED', date: '2026-07-14', phone: '+250 788 234 567' },
    { id: 'c3', userId: '4', contributionTypeId: 'ct1', amount: 30, currency: 'USD', reference: 'MTN-2026071503', status: 'APPROVED', date: '2026-07-13', phone: '+32 489 123 456' },
    { id: 'c4', userId: '3', contributionTypeId: 'ct2', amount: 3000, currency: 'RWF', reference: 'MTN-2026071504', status: 'PENDING', date: '2026-07-18', phone: '+250 788 345 678' },
    { id: 'c5', userId: '5', contributionTypeId: 'ct5', amount: 25, currency: 'USD', reference: 'MTN-2026071505', status: 'APPROVED', date: '2026-07-12', phone: '+1 647 890 1234' },
    { id: 'c6', userId: '6', contributionTypeId: 'ct3', amount: 500, currency: 'RWF', reference: 'MTN-2026071506', status: 'APPROVED', date: '2026-07-10', phone: '+250 788 456 789' },
    { id: 'c7', userId: '7', contributionTypeId: 'ct1', amount: 30, currency: 'USD', reference: 'MTN-2026071507', status: 'PENDING', date: '2026-07-19', phone: '+44 7700 900123' },
    { id: 'c8', userId: '9', contributionTypeId: 'ct4', amount: 1500, currency: 'RWF', reference: 'MTN-2026071508', status: 'APPROVED', date: '2026-07-08', phone: '+250 788 678 901' },
    { id: 'c9', userId: '12', contributionTypeId: 'ct2', amount: 3000, currency: 'RWF', reference: 'MTN-2026071509', status: 'APPROVED', date: '2026-07-05', phone: '+250 788 890 123' },
    { id: 'c10', userId: '15', contributionTypeId: 'ct6', amount: 50, currency: 'USD', reference: 'MTN-2026071510', status: 'REJECTED', date: '2026-07-03', phone: '+1 202 555 0143' },
    { id: 'c11', userId: '10', contributionTypeId: 'ct1', amount: 10, currency: 'USD', reference: 'MTN-2026071511', status: 'APPROVED', date: '2026-07-01', phone: '+49 170 1234567' },
    { id: 'c12', userId: '14', contributionTypeId: 'ct1', amount: 5000, currency: 'RWF', reference: 'MTN-2026071512', status: 'APPROVED', date: '2026-06-28', phone: '+250 788 901 234' },
    { id: 'c13', userId: '1', contributionTypeId: 'ct2', amount: 3000, currency: 'RWF', reference: 'MTN-2026071513', status: 'APPROVED', date: '2026-06-25', phone: '+250 788 123 456' },
    { id: 'c14', userId: '11', contributionTypeId: 'ct3', amount: 500, currency: 'RWF', reference: 'MTN-2026071514', status: 'PENDING', date: '2026-07-20', phone: '+250 788 789 012' },
  ];

  for (const c of DEMO_CONTRIBUTIONS) {
    const createdContrib = await prisma.contribution.create({
      data: {
        id: c.id,
        userId: c.userId,
        contributionTypeId: c.contributionTypeId,
        amount: c.amount,
        currency: c.currency,
        status: c.status,
        createdAt: new Date(c.date),
        notes: `Demo reference: ${c.reference}`,
      }
    });

    // Seed payment transaction records
    await prisma.payment.create({
      data: {
        contributionId: createdContrib.id,
        transactionRef: c.reference,
        phone: c.phone,
        amount: c.amount,
        currency: c.currency,
        status: c.status === 'APPROVED' ? 'SUCCESSFUL' : c.status === 'REJECTED' ? 'FAILED' : 'PENDING',
      }
    });
  }

  console.log('Seeding campaigns...');
  const DEMO_CAMPAIGNS = [
    { id: 'camp1', title: 'New Church Building', description: 'Building a house of worship that will serve generations. Our vision is to create a space that glorifies God and brings the community together.', goal: 50000000, raised: 32450000, currency: 'RWF', startDate: '2025-01-01', endDate: '2026-12-31', status: 'ACTIVE', featured: true },
    { id: 'camp2', title: 'Youth Mission Trip', description: 'Sending 20 young people to spread the gospel and serve communities in need across East Africa.', goal: 5000000, raised: 3200000, currency: 'RWF', startDate: '2026-06-01', endDate: '2026-09-30', status: 'ACTIVE', featured: true },
    { id: 'camp3', title: 'Worship Equipment', description: 'Upgrading our sound system, instruments, and stage lighting for a more impactful worship experience.', goal: 8000000, raised: 8000000, currency: 'RWF', startDate: '2025-06-01', endDate: '2026-03-31', status: 'COMPLETED', featured: false },
    { id: 'camp4', title: 'Community Outreach', description: 'Providing food, clothing, and spiritual support to underserved communities around Kigali.', goal: 3000000, raised: 1850000, currency: 'RWF', startDate: '2026-04-01', endDate: '2026-10-31', status: 'ACTIVE', featured: false },
  ];

  for (const camp of DEMO_CAMPAIGNS) {
    await prisma.campaign.create({
      data: {
        id: camp.id,
        title: camp.title,
        description: camp.description,
        goal: camp.goal,
        raised: camp.raised,
        currency: camp.currency,
        startDate: new Date(camp.startDate),
        endDate: new Date(camp.endDate),
        status: camp.status,
        featured: camp.featured,
      }
    });
  }

  console.log('Seeding calendar events...');
  const DEMO_EVENTS = [
    { id: 'e1', title: 'Sunday Worship Service', startTime: '2026-07-20T09:00:00Z', endTime: '2026-07-20T12:00:00Z', location: 'Shining Ministries Main Hall', category: 'Worship', recurring: true, description: 'Join us for a powerful time of worship and the Word.' },
    { id: 'e2', title: 'Youth Fellowship', startTime: '2026-07-22T17:00:00Z', endTime: '2026-07-22T19:00:00Z', location: 'Youth Center', category: 'Youth', recurring: true, description: 'Weekly youth gathering for prayer, worship, and fellowship.' },
    { id: 'e3', title: 'Prayer Night', startTime: '2026-07-24T19:00:00Z', endTime: '2026-07-24T21:00:00Z', location: 'Prayer Room', category: 'Prayer', recurring: true, description: 'Midweek prayer meeting for spiritual growth and intercession.' },
    { id: 'e4', title: 'Leadership Summit', startTime: '2026-08-02T10:00:00Z', endTime: '2026-08-02T16:00:00Z', location: 'Conference Hall', category: 'Conference', recurring: false, description: 'Annual leadership development conference for ministry leaders.' },
    { id: 'e5', title: 'Choir Practice', startTime: '2026-07-21T16:00:00Z', endTime: '2026-07-21T18:00:00Z', location: 'Music Room', category: 'Music', recurring: true, description: 'Rehearsal for upcoming Sunday services and special events.' },
    { id: 'e6', title: 'Community Service Day', startTime: '2026-08-10T07:00:00Z', endTime: '2026-08-10T12:00:00Z', location: 'Kigali City Center', category: 'Outreach', recurring: false, description: 'Join us as we serve our community through various projects.' },
  ];

  for (const e of DEMO_EVENTS) {
    await prisma.calendarEvent.create({
      data: {
        id: e.id,
        title: e.title,
        description: e.description,
        location: e.location,
        category: e.category,
        startTime: new Date(e.startTime),
        endTime: new Date(e.endTime),
        recurring: e.recurring,
      }
    });
  }

  console.log('Seeding announcements...');
  const DEMO_ANNOUNCEMENTS = [
    { id: 'a1', title: 'Annual Conference Registration Open', category: 'Events', priority: 'high', publishDate: '2026-07-18T00:00:00Z', description: 'Registration is now open for the 2026 Annual Ministry Conference. Early bird discounts available until August 15th.' },
    { id: 'a2', title: 'New Building Fund Update', category: 'Fundraising', priority: 'normal', publishDate: '2026-07-15T00:00:00Z', description: 'We have reached 65% of our building fund goal! Thank you for your generous contributions. Let\'s keep the momentum going.' },
    { id: 'a3', title: 'Prayer Week Starting Monday', category: 'Prayer', priority: 'high', publishDate: '2026-07-19T00:00:00Z', description: 'Join us for a special week of prayer and fasting starting this Monday through Friday. Services at 6 AM and 7 PM daily.' },
    { id: 'a4', title: 'Youth Camp Registration', category: 'Youth', priority: 'normal', publishDate: '2026-07-12T00:00:00Z', description: 'Youth camp spots are filling up fast! Register your children aged 13-18 for an unforgettable week of faith and fun.' },
    { id: 'a5', title: 'Volunteer Appreciation Sunday', category: 'News', priority: 'low', publishDate: '2026-07-10T00:00:00Z', description: 'Join us this Sunday as we honor and celebrate all our amazing volunteers who serve faithfully.' },
  ];

  for (const a of DEMO_ANNOUNCEMENTS) {
    await prisma.announcement.create({
      data: {
        id: a.id,
        title: a.title,
        description: a.description,
        category: a.category,
        priority: a.priority,
        publishDate: new Date(a.publishDate),
      }
    });
  }

  console.log('Seeding attendance events...');
  const DEMO_ATTENDANCE = [
    { id: 'att1', event: 'Sunday Worship Service', date: '2026-07-20', total: 187, capacity: 250 },
    { id: 'att2', event: 'Sunday Worship Service', date: '2026-07-13', total: 203, capacity: 250 },
    { id: 'att3', event: 'Youth Fellowship', date: '2026-07-15', total: 42, capacity: 60 },
    { id: 'att4', event: 'Prayer Night', date: '2026-07-17', total: 65, capacity: 100 },
    { id: 'att5', event: 'Sunday Worship Service', date: '2026-07-06', total: 195, capacity: 250 },
  ];

  for (const att of DEMO_ATTENDANCE) {
    await prisma.attendanceEvent.create({
      data: {
        id: att.id,
        title: att.event,
        qrCode: `qr-${att.id}-${Date.now()}`,
        qrExpiration: new Date('2026-12-31T23:59:59Z'),
        startTime: new Date(`${att.date}T08:00:00Z`),
        endTime: new Date(`${att.date}T12:00:00Z`),
      }
    });
  }

  console.log('Seeding conversations & messages...');
  const DEMO_MESSAGES = [
    { id: 'msg1', userId: '1', subject: 'Contribution Receipt', content: 'Thank you for the receipt. God bless!', date: '2026-07-19T10:00:00Z', unread: false },
    { id: 'msg2', userId: '4', subject: 'Payment Issue', content: 'My MoMo payment didn\'t go through, can you help?', date: '2026-07-20T12:00:00Z', unread: true },
    { id: 'msg3', userId: '6', subject: 'Youth Camp Question', content: 'Is there a discount for multiple children?', date: '2026-07-18T14:30:00Z', unread: true },
    { id: 'msg4', userId: '5', subject: 'Diaspora Event', content: 'Will there be an online stream for the conference?', date: '2026-07-17T09:15:00Z', unread: false },
  ];

  for (const m of DEMO_MESSAGES) {
    const conv = await prisma.conversation.create({
      data: {
        subject: m.subject,
        status: 'open',
        createdAt: new Date(m.date),
      }
    });

    await prisma.message.create({
      data: {
        id: m.id,
        conversationId: conv.id,
        senderId: m.userId,
        content: m.content,
        read: m.unread === false,
        createdAt: new Date(m.date),
      }
    });
  }

  console.log('Database seeding complete successfully!');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
