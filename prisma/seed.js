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
      email: 'admin@gmail.com',
      passwordHash: hashPassword('admin123'),
      role: 'SUPER_ADMIN',
    }
  });

  // Initial System Setup completed
  console.log('Seeding initial contribution types...');
  const INITIAL_CONTRIBUTION_TYPES = [
    { id: 'ct1', name: 'Monthly Contribution', description: 'Regular monthly contribution to support ministry operations', category: 'Regular', localStudentAmt: 2000, localEmployedAmt: 5000, diasporaStudentAmt: 10, diasporaEmployedAmt: 30, currency: 'RWF', recurring: true, active: true, icon: '💰', color: '#D4A843' },
    { id: 'ct2', name: 'Building Fund', description: 'Contribution towards the new church building project', category: 'Project', localStudentAmt: 1000, localEmployedAmt: 3000, diasporaStudentAmt: 5, diasporaEmployedAmt: 20, currency: 'RWF', recurring: true, active: true, icon: '🏗️', color: '#3B5BDB' },
    { id: 'ct3', name: 'Youth Ministry', description: 'Supporting youth programs and activities', category: 'Ministry', localStudentAmt: 500, localEmployedAmt: 2000, diasporaStudentAmt: 5, diasporaEmployedAmt: 15, currency: 'RWF', recurring: false, active: true, icon: '🌟', color: '#2B8A3E' },
    { id: 'ct4', name: 'Choir Fund', description: 'Equipment, costumes, and choir event support', category: 'Ministry', localStudentAmt: 500, localEmployedAmt: 1500, diasporaStudentAmt: 3, diasporaEmployedAmt: 10, currency: 'RWF', recurring: false, active: true, icon: '🎵', color: '#9C36B5' },
    { id: 'ct5', name: 'Mission Support', description: 'Funding missions and outreach programs', category: 'Mission', localStudentAmt: 1000, localEmployedAmt: 3000, diasporaStudentAmt: 10, diasporaEmployedAmt: 25, currency: 'RWF', recurring: false, active: true, icon: '✈️', color: '#E8590C' },
    { id: 'ct6', name: 'Special Offering', description: 'Special seasonal or event-based offerings', category: 'Special', localStudentAmt: 0, localEmployedAmt: 0, diasporaStudentAmt: 0, diasporaEmployedAmt: 0, currency: 'RWF', recurring: false, active: true, icon: '🎁', color: '#F59F00' },
  ];

  for (const type of INITIAL_CONTRIBUTION_TYPES) {
    await prisma.contributionType.create({
      data: type
    });
  }

  // No other demo data seeded.

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
