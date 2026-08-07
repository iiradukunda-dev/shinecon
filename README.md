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

## System Architecture & Features

```mermaid
flowchart LR
    %% User Journey
    Member([ Member]) -->|Accesses| App[ Member App]
    App -->|Makes| Contrib[ Contributions]
    App -->|Consults| AI[ AI Assistant]
    
    %% Admin Journey
    Admin([👑 Admin]) -->|Manages| Dash[ Admin Dashboard]
    Dash -->|Approves| Contrib
    Dash -->|Monitors| Analytics[ Analytics & Reports]
    
    %% Styling
    style Member fill:#0a0a0e,stroke:#d4a843,stroke-width:2px,color:#fff
    style Admin fill:#0a0a0e,stroke:#d4a843,stroke-width:2px,color:#fff
```

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
