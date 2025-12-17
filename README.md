<div align="center">

# ApsaraMenu

### The White-Label Digital Menu Platform for Modern Restaurants

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

**Create stunning, scannable digital menus in minutes. No code required.**

[Get Started](#quick-start) · [Features](#features) · [Tech Stack](#tech-stack) · [Documentation](#documentation)

</div>

---

> [!NOTE]
> This project is actively under development. We're building something fresh.

## What is ApsaraMenu?

ApsaraMenu is a **white-label digital menu platform** designed for the modern hospitality industry. Built mobile-first and server-first, it empowers restaurants, cafes, bars, and food trucks to create beautiful, QR-scannable menus that match their brand identity.

**Why ApsaraMenu?**

- **White-Label Ready** — Your brand, your domain, your menu. Fully customizable to match any identity.
- **Mobile-First Design** — Built for the way Gen Z and millennials actually browse menus — on their phones.
- **Real-Time Updates** — Change prices, add items, or update photos instantly. No reprinting, no hassle.
- **Multi-Location Support** — Manage menus across multiple venues from a single dashboard.
- **Lightning Fast** — Server components + edge deployment = menus that load in milliseconds.

## Features

| Feature                    | Description                                         |
| -------------------------- | --------------------------------------------------- |
| **Visual Menu Editor**     | Drag-and-drop builder with live preview             |
| **QR Code Generator**      | Auto-generated, branded QR codes for each menu      |
| **Multi-Language Support** | Serve global customers with localized menus         |
| **Custom Domains**         | Use your own subdomain or custom domain             |
| **Analytics Dashboard**    | Track views, popular items, and customer engagement |
| **Team Collaboration**     | Invite staff with role-based permissions            |
| **Image Optimization**     | Auto-compressed, WebP-converted menu photos         |
| **Stripe Integration**     | Built-in billing for SaaS subscription management   |

## Tech Stack

ApsaraMenu is built with a modern, production-ready stack:

| Layer              | Technology                                  |
| ------------------ | ------------------------------------------- |
| **Framework**      | Next.js 15 (App Router) + React 19          |
| **Language**       | TypeScript (strict mode)                    |
| **Styling**        | Tailwind CSS + Shadcn UI + Radix Primitives |
| **Database**       | Prisma ORM + Turso (Edge SQLite)            |
| **Auth**           | Better-auth with middleware protection      |
| **Forms**          | React Hook Form + Zod validation            |
| **State**          | nuqs (URL state) + Jotai (client state)     |
| **Server Actions** | next-safe-action (type-safe mutations)      |
| **File Storage**   | Cloudflare R2 / AWS S3                      |
| **Payments**       | Stripe (subscriptions + billing)            |
| **Email**          | React Email + Resend                        |
| **Analytics**      | PostHog + Sentry                            |
| **Runtime**        | Bun                                         |

## Quick Start

Get ApsaraMenu running locally in under 5 minutes.

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 20+
- A Turso account for the database
- Environment variables (see `.env.example`)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/apsaramenu.git
cd apsaramenu

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
bun run predev

# Start local database
bun run db:dev

# Launch dev server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) and start building.

### Available Scripts

```bash
bun run dev          # Start dev server with Turbopack
bun run build        # Production build
bun run start        # Start production server
bun run lint         # ESLint checks
bun run lint:fix     # ESLint with auto-fix
bun run format       # Prettier formatting
bun run typecheck    # TypeScript type checking
bun run db:dev       # Local Turso database
bun run stripe:listen # Stripe webhook forwarding
bun run email        # Email dev preview
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth routes (login, signup)
│   ├── (marketing)/       # Public marketing pages
│   ├── [subdomain]/       # White-label tenant routes
│   ├── dashboard/         # Main app dashboard
│   └── menu-editor/       # Visual menu builder
├── components/
│   ├── ui/                # Shadcn UI components
│   ├── features/          # Feature-specific components
│   └── shared/            # Shared/reusable components
├── server/
│   ├── actions/           # Server actions (mutations)
│   └── dal/               # Data Access Layer
├── lib/                   # Utilities and helpers
└── hooks/                 # Custom React hooks
```

## Documentation

| Resource                                                 | Description                              |
| -------------------------------------------------------- | ---------------------------------------- |
| [`AGENTS.md`](./AGENTS.md)                               | AI agent guidelines and code conventions |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)         | System architecture overview             |
| [`docs/REFACTORING_PLAN.md`](./docs/REFACTORING_PLAN.md) | Current refactoring roadmap              |
| [`src/env.mjs`](./src/env.mjs)                           | Environment variables schema             |
| [`prisma/schema.prisma`](./prisma/schema.prisma)         | Database schema                          |

## Key Conventions

- **Server Components First** — Minimize `'use client'` directives
- **Type Safety** — No `any` types; use proper interfaces
- **Zod Validation** — All forms use React Hook Form + Zod
- **Conventional Commits** — `feat:`, `fix:`, `refactor:`, etc.
- **Mobile-First CSS** — Tailwind responsive utilities

## Contributing

We welcome contributions! Please read [`AGENTS.md`](./AGENTS.md) for code style guidelines and conventions before submitting a PR.

```bash
# Run checks before committing
bun run typecheck
bun run lint
```

## Credits

ApsaraMenu is built upon the excellent work of [Biztro](https://github.com/dkast/biztro) by [@dkast](https://github.com/dkast). Thank you for the amazing foundation!

## License

MIT License. See [LICENSE](./LICENSE) for details.

---

<div align="center">

**Built with love for the modern hospitality industry.**

[Website](https://apsaramenu.com) · [Documentation](./docs) · [Report Bug](https://github.com/your-org/apsaramenu/issues)

</div>
