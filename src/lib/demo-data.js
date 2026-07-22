// SM Connect — Demo Data
// Comprehensive sample data for all modules

export const DEMO_MEMBERS = [
  { id: '1', name: 'Jean-Pierre Habimana', email: 'jp.habimana@email.com', phone: '+250 788 123 456', country: 'Rwanda', photo: null, type: 'local', employment: 'employed', status: 'approved', joinedDate: '2024-01-15', lastLogin: '2026-07-20' },
  { id: '2', name: 'Marie Claire Uwimana', email: 'mc.uwimana@email.com', phone: '+250 788 234 567', country: 'Rwanda', photo: null, type: 'local', employment: 'student', status: 'approved', joinedDate: '2024-02-20', lastLogin: '2026-07-19' },
  { id: '3', name: 'Emmanuel Nsengiyumva', email: 'e.nsengiyumva@email.com', phone: '+250 788 345 678', country: 'Rwanda', photo: null, type: 'local', employment: 'employed', status: 'approved', joinedDate: '2024-03-10', lastLogin: '2026-07-18' },
  { id: '4', name: 'Grace Mukamana', email: 'g.mukamana@email.com', phone: '+32 489 123 456', country: 'Belgium', photo: null, type: 'diaspora', employment: 'employed', status: 'approved', joinedDate: '2024-04-05', lastLogin: '2026-07-20' },
  { id: '5', name: 'Patrick Niyonzima', email: 'p.niyonzima@email.com', phone: '+1 647 890 1234', country: 'Canada', photo: null, type: 'diaspora', employment: 'employed', status: 'approved', joinedDate: '2024-05-12', lastLogin: '2026-07-17' },
  { id: '6', name: 'Diane Ingabire', email: 'd.ingabire@email.com', phone: '+250 788 456 789', country: 'Rwanda', photo: null, type: 'local', employment: 'student', status: 'approved', joinedDate: '2024-06-01', lastLogin: '2026-07-20' },
  { id: '7', name: 'Samuel Bizimana', email: 's.bizimana@email.com', phone: '+44 7700 900123', country: 'United Kingdom', photo: null, type: 'diaspora', employment: 'employed', status: 'approved', joinedDate: '2024-06-15', lastLogin: '2026-07-16' },
  { id: '8', name: 'Claudine Nyiraneza', email: 'c.nyiraneza@email.com', phone: '+250 788 567 890', country: 'Rwanda', photo: null, type: 'local', employment: 'employed', status: 'pending', joinedDate: '2026-07-18', lastLogin: null },
  { id: '9', name: 'David Mugabo', email: 'd.mugabo@email.com', phone: '+250 788 678 901', country: 'Rwanda', photo: null, type: 'local', employment: 'employed', status: 'approved', joinedDate: '2024-07-20', lastLogin: '2026-07-15' },
  { id: '10', name: 'Esperance Mutoni', email: 'e.mutoni@email.com', phone: '+49 170 1234567', country: 'Germany', photo: null, type: 'diaspora', employment: 'student', status: 'approved', joinedDate: '2024-08-10', lastLogin: '2026-07-19' },
  { id: '11', name: 'Innocent Hakizimana', email: 'i.hakizimana@email.com', phone: '+250 788 789 012', country: 'Rwanda', photo: null, type: 'local', employment: 'student', status: 'approved', joinedDate: '2024-09-01', lastLogin: '2026-07-14' },
  { id: '12', name: 'Jeannette Umutoni', email: 'j.umutoni@email.com', phone: '+250 788 890 123', country: 'Rwanda', photo: null, type: 'local', employment: 'employed', status: 'approved', joinedDate: '2024-09-15', lastLogin: '2026-07-20' },
  { id: '13', name: 'Thierry Ndayisaba', email: 't.ndayisaba@email.com', phone: '+33 6 12 34 56 78', country: 'France', photo: null, type: 'diaspora', employment: 'employed', status: 'pending', joinedDate: '2026-07-19', lastLogin: null },
  { id: '14', name: 'Beatrice Uwase', email: 'b.uwase@email.com', phone: '+250 788 901 234', country: 'Rwanda', photo: null, type: 'local', employment: 'employed', status: 'approved', joinedDate: '2024-10-20', lastLogin: '2026-07-18' },
  { id: '15', name: 'Olivier Nshimiyimana', email: 'o.nshimiyimana@email.com', phone: '+1 202 555 0143', country: 'United States', photo: null, type: 'diaspora', employment: 'employed', status: 'approved', joinedDate: '2024-11-05', lastLogin: '2026-07-20' },
];

export const DEMO_CONTRIBUTION_TYPES = [
  { id: 'ct1', name: 'Monthly Contribution', description: 'Regular monthly contribution to support ministry operations', category: 'Regular', localStudent: 2000, localEmployed: 5000, diasporaStudent: 10, diasporaEmployed: 30, currency: { local: 'RWF', diaspora: 'USD' }, recurring: true, active: true, icon: '💰', color: '#D4A843' },
  { id: 'ct2', name: 'Building Fund', description: 'Contribution towards the new church building project', category: 'Project', localStudent: 1000, localEmployed: 3000, diasporaStudent: 5, diasporaEmployed: 20, currency: { local: 'RWF', diaspora: 'USD' }, recurring: true, active: true, icon: '🏗️', color: '#3B5BDB' },
  { id: 'ct3', name: 'Youth Ministry', description: 'Supporting youth programs and activities', category: 'Ministry', localStudent: 500, localEmployed: 2000, diasporaStudent: 5, diasporaEmployed: 15, currency: { local: 'RWF', diaspora: 'USD' }, recurring: false, active: true, icon: '🌟', color: '#2B8A3E' },
  { id: 'ct4', name: 'Choir Fund', description: 'Equipment, costumes, and choir event support', category: 'Ministry', localStudent: 500, localEmployed: 1500, diasporaStudent: 3, diasporaEmployed: 10, currency: { local: 'RWF', diaspora: 'USD' }, recurring: false, active: true, icon: '🎵', color: '#9C36B5' },
  { id: 'ct5', name: 'Mission Support', description: 'Funding missions and outreach programs', category: 'Mission', localStudent: 1000, localEmployed: 3000, diasporaStudent: 10, diasporaEmployed: 25, currency: { local: 'RWF', diaspora: 'USD' }, recurring: false, active: true, icon: '✈️', color: '#E8590C' },
  { id: 'ct6', name: 'Special Offering', description: 'Special seasonal or event-based offerings', category: 'Special', localStudent: 0, localEmployed: 0, diasporaStudent: 0, diasporaEmployed: 0, currency: { local: 'RWF', diaspora: 'USD' }, recurring: false, active: true, icon: '🎁', color: '#F59F00' },
];

export const DEMO_CONTRIBUTIONS = [
  { id: 'c1', memberId: '1', memberName: 'Jean-Pierre Habimana', type: 'Monthly Contribution', amount: 5000, currency: 'RWF', reference: 'MTN-2026071501', status: 'approved', date: '2026-07-15', phone: '+250 788 123 456' },
  { id: 'c2', memberId: '2', memberName: 'Marie Claire Uwimana', type: 'Monthly Contribution', amount: 2000, currency: 'RWF', reference: 'MTN-2026071502', status: 'approved', date: '2026-07-14', phone: '+250 788 234 567' },
  { id: 'c3', memberId: '4', memberName: 'Grace Mukamana', type: 'Monthly Contribution', amount: 30, currency: 'USD', reference: 'MTN-2026071503', status: 'approved', date: '2026-07-13', phone: '+32 489 123 456' },
  { id: 'c4', memberId: '3', memberName: 'Emmanuel Nsengiyumva', type: 'Building Fund', amount: 3000, currency: 'RWF', reference: 'MTN-2026071504', status: 'pending', date: '2026-07-18', phone: '+250 788 345 678' },
  { id: 'c5', memberId: '5', memberName: 'Patrick Niyonzima', type: 'Mission Support', amount: 25, currency: 'USD', reference: 'MTN-2026071505', status: 'approved', date: '2026-07-12', phone: '+1 647 890 1234' },
  { id: 'c6', memberId: '6', memberName: 'Diane Ingabire', type: 'Youth Ministry', amount: 500, currency: 'RWF', reference: 'MTN-2026071506', status: 'approved', date: '2026-07-10', phone: '+250 788 456 789' },
  { id: 'c7', memberId: '7', memberName: 'Samuel Bizimana', type: 'Monthly Contribution', amount: 30, currency: 'USD', reference: 'MTN-2026071507', status: 'pending', date: '2026-07-19', phone: '+44 7700 900123' },
  { id: 'c8', memberId: '9', memberName: 'David Mugabo', type: 'Choir Fund', amount: 1500, currency: 'RWF', reference: 'MTN-2026071508', status: 'approved', date: '2026-07-08', phone: '+250 788 678 901' },
  { id: 'c9', memberId: '12', memberName: 'Jeannette Umutoni', type: 'Building Fund', amount: 3000, currency: 'RWF', reference: 'MTN-2026071509', status: 'approved', date: '2026-07-05', phone: '+250 788 890 123' },
  { id: 'c10', memberId: '15', memberName: 'Olivier Nshimiyimana', type: 'Special Offering', amount: 50, currency: 'USD', reference: 'MTN-2026071510', status: 'rejected', date: '2026-07-03', phone: '+1 202 555 0143' },
  { id: 'c11', memberId: '10', memberName: 'Esperance Mutoni', type: 'Monthly Contribution', amount: 10, currency: 'USD', reference: 'MTN-2026071511', status: 'approved', date: '2026-07-01', phone: '+49 170 1234567' },
  { id: 'c12', memberId: '14', memberName: 'Beatrice Uwase', type: 'Monthly Contribution', amount: 5000, currency: 'RWF', reference: 'MTN-2026071512', status: 'approved', date: '2026-06-28', phone: '+250 788 901 234' },
  { id: 'c13', memberId: '1', memberName: 'Jean-Pierre Habimana', type: 'Building Fund', amount: 3000, currency: 'RWF', reference: 'MTN-2026071513', status: 'approved', date: '2026-06-25', phone: '+250 788 123 456' },
  { id: 'c14', memberId: '11', memberName: 'Innocent Hakizimana', type: 'Youth Ministry', amount: 500, currency: 'RWF', reference: 'MTN-2026071514', status: 'pending', date: '2026-07-20', phone: '+250 788 789 012' },
];

export const DEMO_CAMPAIGNS = [
  { id: 'camp1', title: 'New Church Building', description: 'Building a house of worship that will serve generations. Our vision is to create a space that glorifies God and brings the community together.', goal: 50000000, raised: 32450000, currency: 'RWF', startDate: '2025-01-01', endDate: '2026-12-31', status: 'active', featured: true, contributors: 89, image: '🏛️' },
  { id: 'camp2', title: 'Youth Mission Trip', description: 'Sending 20 young people to spread the gospel and serve communities in need across East Africa.', goal: 5000000, raised: 3200000, currency: 'RWF', startDate: '2026-06-01', endDate: '2026-09-30', status: 'active', featured: true, contributors: 45, image: '🌍' },
  { id: 'camp3', title: 'Worship Equipment', description: 'Upgrading our sound system, instruments, and stage lighting for a more impactful worship experience.', goal: 8000000, raised: 8000000, currency: 'RWF', startDate: '2025-06-01', endDate: '2026-03-31', status: 'completed', featured: false, contributors: 67, image: '🎸' },
  { id: 'camp4', title: 'Community Outreach', description: 'Providing food, clothing, and spiritual support to underserved communities around Kigali.', goal: 3000000, raised: 1850000, currency: 'RWF', startDate: '2026-04-01', endDate: '2026-10-31', status: 'active', featured: false, contributors: 34, image: '🤝' },
];

export const DEMO_EVENTS = [
  { id: 'e1', title: 'Sunday Worship Service', date: '2026-07-20', time: '09:00', location: 'Shining Ministries Main Hall', category: 'Worship', recurring: true, description: 'Join us for a powerful time of worship and the Word.' },
  { id: 'e2', title: 'Youth Fellowship', date: '2026-07-22', time: '17:00', location: 'Youth Center', category: 'Youth', recurring: true, description: 'Weekly youth gathering for prayer, worship, and fellowship.' },
  { id: 'e3', title: 'Prayer Night', date: '2026-07-24', time: '19:00', location: 'Prayer Room', category: 'Prayer', recurring: true, description: 'Midweek prayer meeting for spiritual growth and intercession.' },
  { id: 'e4', title: 'Leadership Summit', date: '2026-08-02', time: '10:00', location: 'Conference Hall', category: 'Conference', recurring: false, description: 'Annual leadership development conference for ministry leaders.' },
  { id: 'e5', title: 'Choir Practice', date: '2026-07-21', time: '16:00', location: 'Music Room', category: 'Music', recurring: true, description: 'Rehearsal for upcoming Sunday services and special events.' },
  { id: 'e6', title: 'Community Service Day', date: '2026-08-10', time: '07:00', location: 'Kigali City Center', category: 'Outreach', recurring: false, description: 'Join us as we serve our community through various projects.' },
];

export const DEMO_ANNOUNCEMENTS = [
  { id: 'a1', title: 'Annual Conference Registration Open', category: 'Events', priority: 'high', date: '2026-07-18', description: 'Registration is now open for the 2026 Annual Ministry Conference. Early bird discounts available until August 15th.', image: '📣' },
  { id: 'a2', title: 'New Building Fund Update', category: 'Fundraising', priority: 'normal', date: '2026-07-15', description: 'We have reached 65% of our building fund goal! Thank you for your generous contributions. Let\'s keep the momentum going.', image: '🏗️' },
  { id: 'a3', title: 'Prayer Week Starting Monday', category: 'Prayer', priority: 'high', date: '2026-07-19', description: 'Join us for a special week of prayer and fasting starting this Monday through Friday. Services at 6 AM and 7 PM daily.', image: '🙏' },
  { id: 'a4', title: 'Youth Camp Registration', category: 'Youth', priority: 'normal', date: '2026-07-12', description: 'Youth camp spots are filling up fast! Register your children aged 13-18 for an unforgettable week of faith and fun.', image: '⛺' },
  { id: 'a5', title: 'Volunteer Appreciation Sunday', category: 'News', priority: 'low', date: '2026-07-10', description: 'Join us this Sunday as we honor and celebrate all our amazing volunteers who serve faithfully.', image: '🌟' },
];

export const DEMO_ATTENDANCE = [
  { id: 'att1', event: 'Sunday Worship Service', date: '2026-07-20', total: 187, capacity: 250 },
  { id: 'att2', event: 'Sunday Worship Service', date: '2026-07-13', total: 203, capacity: 250 },
  { id: 'att3', event: 'Youth Fellowship', date: '2026-07-15', total: 42, capacity: 60 },
  { id: 'att4', event: 'Prayer Night', date: '2026-07-17', total: 65, capacity: 100 },
  { id: 'att5', event: 'Sunday Worship Service', date: '2026-07-06', total: 195, capacity: 250 },
];

export const DEMO_MESSAGES = [
  { id: 'm1', from: 'Jean-Pierre Habimana', subject: 'Contribution Receipt', lastMessage: 'Thank you for the receipt. God bless!', date: '2026-07-19', unread: false },
  { id: 'm2', from: 'Grace Mukamana', subject: 'Payment Issue', lastMessage: 'My MoMo payment didn\'t go through, can you help?', date: '2026-07-20', unread: true },
  { id: 'm3', from: 'Diane Ingabire', subject: 'Youth Camp Question', lastMessage: 'Is there a discount for multiple children?', date: '2026-07-18', unread: true },
  { id: 'm4', from: 'Patrick Niyonzima', subject: 'Diaspora Event', lastMessage: 'Will there be an online stream for the conference?', date: '2026-07-17', unread: false },
];

export const DEMO_AI_SUGGESTIONS = [
  'How much have I contributed this year?',
  'What contributions are due this month?',
  'Show my recent receipts',
  'What events are coming up?',
  'Which campaigns are active?',
  'Have I attended this month\'s service?',
];

export const DEMO_ADMIN_AI_SUGGESTIONS = [
  'Summarize this month\'s finances',
  'Compare local vs diaspora contributions',
  'Which campaign raised the most?',
  'Show pending approvals',
  'Analyze attendance trends',
  'Generate ministry performance report',
];

export const MONTHLY_CONTRIBUTION_DATA = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  local: [420000, 385000, 450000, 410000, 475000, 490000, 520000],
  diaspora: [280, 310, 250, 340, 290, 365, 380],
};

export const ATTENDANCE_TREND = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  data: [165, 178, 182, 190, 195, 201, 203],
};

export const MEMBER_GROWTH = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  data: [120, 128, 135, 142, 148, 155, 162],
};

export const CONTRIBUTION_BY_CATEGORY = {
  labels: ['Monthly', 'Building Fund', 'Youth', 'Choir', 'Mission', 'Special'],
  data: [45, 25, 10, 5, 10, 5],
  colors: ['#D4A843', '#3B5BDB', '#2B8A3E', '#9C36B5', '#E8590C', '#F59F00'],
};

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function formatCurrency(amount, currency = 'RWF') {
  if (currency === 'USD') return `$${amount.toLocaleString()}`;
  if (currency === 'EUR') return `€${amount.toLocaleString()}`;
  return `${amount.toLocaleString()} ${currency}`;
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}
