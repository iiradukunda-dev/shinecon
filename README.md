# SM Connect
<div align="center">

###  Shining Ministries 

**"Byuka, urabagirane, kuko umucyo wawe waje."**
*Arise, shine, for your light has come. — Isaiah 60:1.*

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

## Recent Improvements
- **Full PWA Support:** Transformed the application into a true Progressive Web App (PWA). It is fully installable on iOS, macOS, Android, and Windows directly to the home screen with offline caching via `next-pwa`.
- **UI & Code Cleanliness:** Implemented a massive repository-wide code standardization using Prettier. Refined the Liquid Glass Design System by removing excessive borders and box-shadows, resulting in a significantly flatter, cleaner, and more modern aesthetic.
- **Lightning Fast AI Assistant:** Integrated Gemini AI using the lightweight `gemini-3.5-flash-lite` model for instantaneous, context-aware answers to member questions.
- **Admin Tabbed Interface:** Reorganized system settings into intuitive tabs (Account, System, Integrations, Advanced).
- **Dynamic Application State:** Changes to settings (e.g. Ministry Name, Currency) apply instantly across the application via context syncing without needing a page refresh.
- **Real-Time Localization:** Multilingual implementation supporting dynamic translations across English, Français, Kiswahili, and Kinyarwanda without a reload.
- **Mobile Touch Enhancements:** Upgraded mobile responsiveness by migrating from `onClick` handlers to `next/link` for superior tap targets on Dashboard and KPI cards.

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
│       └── utils.js          # Shared utility functions
└── package.json
```

---

## Database Setup Guide

This project uses **PostgreSQL** with **Prisma ORM**. Before proceeding, ensure that you have Node.js and PostgreSQL installed.

### 1. Environment Configuration

In the root folder of your project (where `package.json` is located), create a `.env` file and define your database connection string:

```env
DATABASE_URL="postgresql://postgres:admin@localhost:5432/smconnect"

# Gmail SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# AI Integration
GEMINI_API_KEY="your-gemini-api-key"
```
*(If your local PostgreSQL user/password differs, adjust the URL accordingly. Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/)).*

### 2. Creating and Migrating the Database

Prisma will automatically create the `smconnect` database if it doesn't exist, and apply the required tables based on `prisma/schema.prisma`.

```bash
# Run database migrations
npx prisma migrate dev --name init
```

### 3. Seeding Initial Data

To populate the system with the initial setup (Super Admin account and default configuration), run the seed script:

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
