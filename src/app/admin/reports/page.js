'use client';

export default function AdminReportsPage() {
  const reports = [
    { name: 'Monthly Contribution Report', description: 'Detailed breakdown of all contributions by type, member, and status', format: ['Excel', 'CSV', 'PDF'], lastGenerated: 'July 15, 2026' },
    { name: 'Member Directory', description: 'Complete list of all members with contact information and status', format: ['Excel', 'CSV'], lastGenerated: 'July 10, 2026' },
    { name: 'Campaign Performance', description: 'Campaign progress, donations, and contributor analysis', format: ['PDF', 'Excel'], lastGenerated: 'July 12, 2026' },
    { name: 'Attendance Summary', description: 'Service attendance records with trends and comparisons', format: ['PDF', 'CSV'], lastGenerated: 'July 18, 2026' },
    { name: 'Financial Statement', description: 'Comprehensive financial overview for ministry leadership', format: ['PDF'], lastGenerated: 'June 30, 2026' },
    { name: 'Audit Log', description: 'System activity log for security and compliance', format: ['CSV'], lastGenerated: 'July 20, 2026' },
  ];

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <h1>Reports</h1>
        <p>Generate and export ministry reports</p>
      </div>

      <div className="grid grid-2 animate-fade-in-up stagger-1">
        {reports.map(report => (
          <div key={report.name} className="glass-card-static" style={{ padding: 'var(--space-lg)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}>
              📄 {report.name}
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', lineHeight: 1.5 }}>
              {report.description}
            </p>
            <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {report.format.map(f => (
                  <span key={f} className="badge badge-gold">{f}</span>
                ))}
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                Last: {report.lastGenerated}
              </span>
            </div>
            <button className="btn btn-gold btn-sm" style={{ width: '100%' }}>
              Generate Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
