# SM Connect
<div align="center">

###  Shining Ministries 

**"Byuka, urabagirane, kuko umucyo wawe waje."**
*Arise, shine, for your light has come. — Isaiah 60:1*

---

A world-class Digital Ministry Management Platform built with
**Next.js 15** • **React 19** • **PostgreSQL** • **Prisma**

</div>

---

## Quick Start

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

## Design System

SM Connect uses a custom **Liquid Glass Design System** featuring:

- **Glassmorphism** — Frosted glass cards with backdrop blur
- **Gold Accent System** — Luxury gold (#D4A843) as primary brand color
- **Dark Mode** — Complete dark theme support
- **Responsive** — Mobile-first, works on all devices
- **Animations** — 15+ keyframe animations with staggered reveals
- **Typography** — Inter + Outfit from Google Fonts

---

## Features

### Member PWA
- Premium dashboard with contribution tracking
- Dynamic contribution types with MTN MoMo payment flow
- Campaign browsing and donations
- QR-based attendance with GPS verification
- AI Assistant with natural language queries
- Profile management with theme/language settings

### Admin Dashboard
- Executive command center with KPI cards
- Complete member management (approve/reject/suspend)
- Contribution approval workflow with fraud detection
- Campaign management with progress analytics
- Enterprise analytics with charts and trends
- Report generation (Excel, CSV, PDF)
- System settings and configuration

### Multi-Language Support
- English
- Français
- Kiswahili
- Kinyarwanda

---

## Project Structure

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

## Database Setup Guide

This project uses **PostgreSQL** with **Prisma ORM**. Before proceeding, ensure that you have Node.js and PostgreSQL installed.

### 1. Environment Configuration

In the root folder of your project (where `package.json` is located), create a `.env` file and define your database connection string:

```env
DATABASE_URL="postgresql://postgres:admin@localhost:5432/smconnect"
```
*(If your local PostgreSQL user/password differs, adjust the URL accordingly).*

### 2. Creating and Migrating the Database

Prisma will automatically create the `smconnect` database if it doesn't exist, and apply the required tables based on `prisma/schema.prisma`.

```bash
# Run database migrations
npx prisma migrate dev --name init
```

### 3. Seeding Demo Data

To populate the system with predefined members, campaigns, events, and financial data, run the seed script:

```bash
npx prisma db seed
```

### 4. Visualizing the Data

Prisma comes with a built-in visual database editor. To view your tables in a web browser, run:

```bash
npx prisma studio
```
This will launch a GUI at `http://localhost:5555`.

---

## Docker Deployment

```bash
docker-compose up -d
```

---

## License

© 2026 Shining Ministries. All rights reserved.

Built with faith.
