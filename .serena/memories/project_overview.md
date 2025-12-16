# ApsaraMenu (Biztro) Project Overview

## Purpose

ApsaraMenu/Biztro is a menu management platform for restaurants and food businesses. It allows businesses to create, manage, and publish digital menus with features like:

- Multi-location support
- Menu item management with variants
- QR code generation
- Online ordering integration
- Stripe payment processing

## Tech Stack

- **Runtime**: Bun (JavaScript/TypeScript)
- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict typing, no `any`)
- **Styling**: Tailwind CSS + Shadcn UI + Radix UI
- **Database**: Prisma ORM + Turso (edge SQLite)
- **Auth**: better-auth with middleware protection
- **Forms**: React Hook Form + Zod validation
- **State**: nuqs (URL), Jotai (client)
- **Payments**: Stripe
- **Email**: React Email + Resend
- **Analytics**: PostHog, Sentry

## Key Directories

```
src/
├── app/          # Next.js App Router pages
├── components/   # React components
├── server/       # Server-side logic
├── lib/          # Utilities
├── hooks/        # Custom React hooks
└── emails/       # Email templates

prisma/           # Database schema & migrations
public/           # Static assets
```

## Architecture Patterns

- Server Components first (minimize `use client`)
- Form validation with Zod schemas
- Server actions with next-safe-action
- Protected routes via middleware
