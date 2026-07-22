# SM Connect — Digital Ministry Platform

<div align="center">

### ✨ Shining Ministries ✨

**"Byuka, urabagirane, kuko umucyo wawe waje."**
*Arise, shine, for your light has come. — Isaiah 60:1*

---

A world-class Digital Ministry Management Platform built with
**Next.js 15** • **React 19** • **PostgreSQL** • **Prisma**

</div>

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (recommended: 20+)
- **npm** or **yarn**

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **http://localhost:3000** to see the splash screen.

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | `admin@smconnect.org` | `admin123` |
| **Member** | `jp.habimana@email.com` | `demo` |

---

## 🎨 Design System

SM Connect uses a custom **Liquid Glass Design System** featuring:

- **Glassmorphism** — Frosted glass cards with backdrop blur
- **Gold Accent System** — Luxury gold (#D4A843) as primary brand color
- **Dark Mode** — Complete dark theme support
- **Responsive** — Mobile-first, works on all devices
- **Animations** — 15+ keyframe animations with staggered reveals
- **Typography** — Inter + Outfit from Google Fonts

---

## 📱 Features

### Member PWA
- 🏠 Premium dashboard with contribution tracking
- 💰 Dynamic contribution types with MTN MoMo payment flow
- 🎯 Campaign browsing and donations
- 📋 QR-based attendance with GPS verification
- ✨ AI Assistant with natural language queries
- 👤 Profile management with theme/language settings

### Admin Dashboard
- 📊 Executive command center with KPI cards
- 👥 Complete member management (approve/reject/suspend)
- 💰 Contribution approval workflow with fraud detection
- 🎯 Campaign management with progress analytics
- 📈 Enterprise analytics with charts and trends
- 📄 Report generation (Excel, CSV, PDF)
- ⚙️ System settings and configuration

### Multi-Language Support
- 🇬🇧 English
- 🇫🇷 Français
- 🇹🇿 Kiswahili
- 🇷🇼 Kinyarwanda

---

## 🏗️ Project Structure

```
shine/
├── prisma/
│   └── schema.prisma        # Full database schema (25+ models)
├── src/
│   ├── app/
│   │   ├── globals.css       # Liquid Glass Design System
│   │   ├── layout.js         # Root layout
│   │   ├── page.js           # Splash screen
│   │   ├── login/            # Authentication
│   │   ├── register/         # Registration
│   │   ├── member/           # Member PWA pages
│   │   │   ├── dashboard/
│   │   │   ├── contributions/
│   │   │   ├── campaigns/
│   │   │   ├── attendance/
│   │   │   ├── announcements/
│   │   │   ├── ai/
│   │   │   └── profile/
│   │   └── admin/            # Admin dashboard pages
│   │       ├── dashboard/
│   │       ├── members/
│   │       ├── contributions/
│   │       ├── campaigns/
│   │       ├── attendance/
│   │       ├── events/
│   │       ├── announcements/
│   │       ├── messages/
│   │       ├── analytics/
│   │       ├── reports/
│   │       └── settings/
│   ├── context/
│   │   └── app-context.js    # Global state management
│   └── lib/
│       └── demo-data.js      # Sample data for demo mode
└── package.json
```

---

## 🔧 Database Setup (Optional)

The app runs in **Demo Mode** by default without a database. To connect PostgreSQL:

```bash
# Set environment variable
echo "DATABASE_URL=postgresql://user:password@localhost:5432/smconnect" > .env

# Install Prisma dependencies
npm install prisma @prisma/client --save-dev

# Run migrations
npx prisma migrate dev --name init

# Seed demo data
npx prisma db seed
```

---

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

---

## 📄 License

© 2026 Shining Ministries. All rights reserved.

Built with ❤️ and faith.
