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

export function getMonthlyContributionData(contributions = []) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const labels = [];
  const local = [];
  const diaspora = [];
  
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(months[d.getMonth()]);
    
    let localSum = 0;
    let diasporaSum = 0;
    
    contributions.forEach(c => {
      if ((c.status || '').toLowerCase() !== 'approved') return;
      const cDate = new Date(c.date || c.createdAt);
      if (cDate.getFullYear() === d.getFullYear() && cDate.getMonth() === d.getMonth()) {
        if (c.currency === 'RWF') {
          localSum += c.amount;
        } else {
          diasporaSum += c.amount;
        }
      }
    });
    
    local.push(localSum);
    diaspora.push(diasporaSum);
  }
  
  return { labels, local, diaspora };
}

export function getAttendanceTrend(attendance = []) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const labels = [];
  const data = [];
  
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(months[d.getMonth()]);
    
    let total = 0;
    attendance.forEach(a => {
      const aDate = new Date(a.date || a.startTime);
      if (aDate.getFullYear() === d.getFullYear() && aDate.getMonth() === d.getMonth()) {
        total += (a.total || 0);
      }
    });
    data.push(total);
  }
  
  return { labels, data };
}

export function getMemberGrowth(members = []) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const labels = [];
  const data = [];
  
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(months[d.getMonth()]);
    
    let count = 0;
    members.forEach(m => {
      if ((m.status || m.approvalStatus || '').toLowerCase() !== 'approved') return;
      const mDate = new Date(m.joinedDate || m.createdAt);
      const eom = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      if (mDate <= eom) {
        count++;
      }
    });
    data.push(count);
  }
  
  return { labels, data };
}

export function getContributionByCategory(contributions = [], contributionTypes = []) {
  const categoryTotals = {};
  let totalAmount = 0;
  
  contributions.forEach(c => {
    if ((c.status || '').toLowerCase() !== 'approved') return;
    const type = contributionTypes.find(t => t.id === c.contributionTypeId);
    const catName = type ? type.name : 'Other';
    const normalizedAmt = c.currency === 'USD' ? c.amount * 1300 : c.currency === 'EUR' ? c.amount * 1400 : c.amount;
    categoryTotals[catName] = (categoryTotals[catName] || 0) + normalizedAmt;
    totalAmount += normalizedAmt;
  });
  
  const labels = [];
  const data = [];
  const defaultColors = ['#D4A843', '#3B5BDB', '#2B8A3E', '#9C36B5', '#E8590C', '#F59F00'];
  const colors = [];
  
  let colorIdx = 0;
  for (const [cat, sum] of Object.entries(categoryTotals)) {
    labels.push(cat);
    data.push(totalAmount > 0 ? Math.round((sum / totalAmount) * 100) : 0);
    colors.push(defaultColors[colorIdx % defaultColors.length]);
    colorIdx++;
  }
  
  if (labels.length === 0) {
    return { labels: ['No Data'], data: [100], colors: ['#555'] };
  }
  
  return { labels, data, colors };
}

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
