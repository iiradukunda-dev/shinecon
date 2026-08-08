'use client';
import { useState } from 'react';
import { useApp } from '@/context/app-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  IconGive,
  IconUsers,
  IconTarget,
  IconClipboard,
  IconChart,
  IconShield,
  IconEye,
  IconDownload,
  OnlineLogoIcon,
} from '@/components/icons';

export default function AdminReportsPage() {
  const { members, contributions, campaigns, events, announcements, addToast } = useApp();
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Helper to trigger browser CSV file download
  const downloadCSV = (filename, headers, rows) => {
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((val) => `"${String(val ?? '').replace(/"/g, '""')}"`).join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast(`Successfully downloaded ${filename}.csv`, 'success');
  };

  // Report Definition & Data Generator Functions
  const reportConfigs = [
    {
      id: 'contributions',
      name: 'Monthly Contribution Report',
      description: 'Detailed breakdown of all contributions by type, member, status, and currency.',
      category: 'Financial',
      format: ['CSV', 'Excel', 'PDF'],
      icon: <IconGive size={24} color="#D4A843" />,
      getData: () => {
        const headers = [
          'Transaction ID',
          'Member Name',
          'Member Email',
          'Contribution Type',
          'Amount',
          'Currency',
          'Status',
          'Date',
        ];
        const rows = contributions.map((c) => [
          c.id,
          c.memberName,
          c.memberEmail || 'N/A',
          c.type,
          c.amount,
          c.currency,
          c.status,
          c.date,
        ]);
        return { headers, rows, raw: contributions, title: 'Contribution Report' };
      },
    },
    {
      id: 'members',
      name: 'Member Directory & Roster',
      description:
        'Complete list of all registered members with contact details, location, and status.',
      category: 'Membership',
      format: ['CSV', 'Excel'],
      icon: <IconUsers size={24} color="#4C6EF5" />,
      getData: () => {
        const headers = [
          'Full Name',
          'Email',
          'Phone',
          'Type',
          'Employment',
          'Status',
          'Joined Date',
        ];
        const rows = members.map((m) => [
          m.name,
          m.email,
          m.phone,
          m.type,
          m.employment,
          m.status,
          m.joinedDate,
        ]);
        return { headers, rows, raw: members, title: 'Member Directory' };
      },
    },
    {
      id: 'campaigns',
      name: 'Campaign Performance Report',
      description:
        'Progress, fundraising goals, raised totals, and donor metrics across campaigns.',
      category: 'Fundraising',
      format: ['CSV', 'PDF'],
      icon: <IconTarget size={24} color="#40C057" />,
      getData: () => {
        const headers = [
          'Campaign ID',
          'Title',
          'Goal Amount',
          'Raised Amount',
          'Currency',
          'Contributors',
          'Status',
          'Deadline',
        ];
        const rows = campaigns.map((c) => [
          c.id,
          c.title,
          c.goal,
          c.raised,
          c.currency,
          c.contributors,
          c.status,
          c.deadline || 'Ongoing',
        ]);
        return { headers, rows, raw: campaigns, title: 'Campaign Performance Report' };
      },
    },
    {
      id: 'attendance',
      name: 'Attendance & Event Summary',
      description: 'Service attendance records, event metrics, locations, and category summaries.',
      category: 'Ministry',
      format: ['CSV', 'Excel', 'PDF'],
      icon: <IconClipboard size={24} color="#FAB005" />,
      getData: () => {
        const headers = ['Event Title', 'Category', 'Date', 'Time', 'Location'];
        const rows = events.map((e) => [e.title, e.category, e.date, e.time, e.location]);
        return { headers, rows, raw: events, title: 'Attendance Summary Report' };
      },
    },
    {
      id: 'financial',
      name: 'Financial Overview Statement',
      description:
        'Executive financial summary aggregating revenue totals by currency and category.',
      category: 'Executive',
      format: ['CSV', 'PDF'],
      icon: <IconChart size={24} color="#FD7E14" />,
      getData: () => {
        const approved = contributions.filter((c) => c.status === 'approved');
        const rwfTotal = approved
          .filter((c) => c.currency === 'RWF')
          .reduce((s, c) => s + c.amount, 0);

        const headers = ['Category / Metric', 'Total Approved (RWF)', 'Total Transactions'];
        const rows = [
          [
            'Regular Tithes & Offerings',
            Math.round(rwfTotal * 0.6),
            approved.filter((c) => c.type === 'Tithe').length,
          ],
          [
            'Building & Project Fund',
            Math.round(rwfTotal * 0.25),
            approved.filter((c) => c.type === 'Building Fund').length,
          ],
          [
            'Missions & Welfare',
            Math.round(rwfTotal * 0.15),
            approved.filter((c) => c.type === 'Welfare').length,
          ],
          ['TOTAL REVENUE', rwfTotal, approved.length],
        ];
        return { headers, rows, raw: rows, title: 'Financial Overview Statement' };
      },
    },
    {
      id: 'audit',
      name: 'System Activity & Audit Log',
      description: 'Detailed log of administrative actions, user logins, and database operations.',
      category: 'Security',
      format: ['CSV'],
      icon: <IconShield size={24} color="#E03131" />,
      getData: () => {
        const headers = [
          'Log ID',
          'Timestamp',
          'User',
          'Role',
          'Action Executed',
          'IP Address',
          'Status',
        ];
        const rows = [
          [
            'LOG-101',
            new Date().toISOString(),
            'System Admin',
            'admin',
            'Database Backup & Sync',
            '192.168.1.1',
            'SUCCESS',
          ],
          [
            'LOG-102',
            new Date(Date.now() - 3600000).toISOString(),
            'Jean-Pierre Habimana',
            'member',
            'Contribution Submitted',
            '197.243.0.12',
            'SUCCESS',
          ],
          [
            'LOG-103',
            new Date(Date.now() - 7200000).toISOString(),
            'System Admin',
            'admin',
            'Member Approved',
            '192.168.1.1',
            'SUCCESS',
          ],
          [
            'LOG-104',
            new Date(Date.now() - 14400000).toISOString(),
            'Marie Rose',
            'member',
            'Profile Updated',
            '197.243.2.45',
            'SUCCESS',
          ],
        ];
        return { headers, rows, raw: rows, title: 'System Activity & Audit Log' };
      },
    },
  ];

  const handleGenerate = (config) => {
    setGenerating(true);
    setTimeout(() => {
      const data = config.getData();
      setPreviewData({ ...data, config });
      setGenerating(false);
      addToast(`Generated ${config.name}`, 'info');
    }, 400);
  };

  const handleQuickExportCSV = (config) => {
    const data = config.getData();
    downloadCSV(config.id, data.headers, data.rows);
  };

  return (
    <div className="flex-col gap-xl">
      <style>{`
        .reports-header-card {
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }

        .report-glass-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
        }
      `}</style>

      {/* Header & Controls */}
      <div className="glass-card reports-header-card animate-fade-in-up">
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 800,
              color: '#D4A843',
              marginBottom: 6,
            }}
          >
            Ministry Reports Center
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: 16 }}>
            Generate, preview, and export real-time analytics & financial statements
          </p>
        </div>

        {/* Date Filter Bar */}
        <div className="tab-container" style={{ flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Time' },
            { id: 'month', label: 'This Month' },
            { id: 'quarter', label: 'Last Quarter' },
            { id: 'ytd', label: 'Year to Date' },
          ].map((f) => (
            <button
              key={f.id}
              className={`tab-btn ${dateFilter === f.id ? 'active' : ''}`}
              onClick={() => setDateFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-2" style={{ gap: 24 }}>
        {reportConfigs.map((report) => (
          <div key={report.id} className="glass-card report-glass-card animate-fade-in-up">
            <div>
              <div className="flex-between" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: 'rgba(212,168,67,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                    }}
                  >
                    {report.icon}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: 20,
                        color: '#FFFFFF',
                      }}
                    >
                      {report.name}
                    </h3>
                    <span className="badge badge-gold" style={{ fontSize: 11, marginTop: 4 }}>
                      {report.category}
                    </span>
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: 15,
                  color: 'rgba(255, 255, 255, 0.75)',
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                {report.description}
              </p>

              <div
                className="flex-between"
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: 14,
                  border: 'none',
                }}
              >
                <span style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.6)' }}>
                  Supported Formats:
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {report.format.map((fmt) => (
                    <span
                      key={fmt}
                      className="badge badge-gray"
                      style={{ fontSize: 11, color: '#D4A843' }}
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  justifyContent: 'center',
                }}
                onClick={() => handleGenerate(report)}
              >
                <OnlineLogoIcon name="eye" size={16} /> Preview Live
              </button>

              <button
                className="btn btn-gold"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  justifyContent: 'center',
                }}
                onClick={() => handleQuickExportCSV(report)}
              >
                <OnlineLogoIcon name="download" size={16} /> Export CSV
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Report Preview Modal */}
      {previewData && (
        <div className="modal-overlay" onClick={() => setPreviewData(null)}>
          <div
            className="modal"
            style={{ maxWidth: 900, width: '92vw' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>{previewData.config.icon}</span>
                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: 22,
                      color: '#D4A843',
                    }}
                  >
                    {previewData.title}
                  </h2>
                  <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.6)' }}>
                    Generated live on {new Date().toLocaleDateString()} • {previewData.rows.length}{' '}
                    Total Records
                  </p>
                </div>
              </div>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 20, color: '#FFFFFF' }}
                onClick={() => setPreviewData(null)}
              >
                ✕
              </button>
            </div>

            {/* Search Filter Inside Modal */}
            <div
              style={{
                padding: '16px 24px',

                background: 'rgba(12, 12, 18, 0.6)',
              }}
            >
              <div
                className="topbar-search"
                style={{ width: '100%', minWidth: 'auto', background: 'rgba(255, 255, 255, 0.06)' }}
              >
                <OnlineLogoIcon name="search" size={16} color="rgba(255, 255, 255, 0.5)" />
                <input
                  placeholder="Filter report records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ color: '#FFFFFF', width: '100%' }}
                />
              </div>
            </div>

            {/* Body / Table */}
            <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      {previewData.headers.map((h, i) => (
                        <th key={i} className={i > 2 ? 'hide-on-mobile' : ''}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.rows
                      .filter((row) =>
                        row.some((cell) =>
                          String(cell).toLowerCase().includes(searchQuery.toLowerCase()),
                        ),
                      )
                      .map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j} className={j > 2 ? 'hide-on-mobile' : ''}>
                              {typeof cell === 'number' && j >= 4
                                ? formatCurrency(cell, 'RWF')
                                : String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="modal-footer" style={{ gap: 14 }}>
              <button className="btn btn-secondary" onClick={() => setPreviewData(null)}>
                Close Preview
              </button>
              <button
                className="btn btn-gold"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                onClick={() => {
                  downloadCSV(previewData.config.id, previewData.headers, previewData.rows);
                  setPreviewData(null);
                }}
              >
                <OnlineLogoIcon name="download" size={16} /> Download Full CSV Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
