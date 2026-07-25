// SM Connect — Demo Data
// Comprehensive sample data for all modules


export const AI_SUGGESTIONS = [
  'How much have I contributed this year?',
  'What contributions are due this month?',
  'Show my recent receipts',
  'What events are coming up?',
  'Which campaigns are active?',
  'Have I attended this month\'s service?',
];

export const ADMIN_AI_SUGGESTIONS = [
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
