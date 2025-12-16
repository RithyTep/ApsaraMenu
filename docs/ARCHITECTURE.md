# ApsaraMenu Architecture Guide

> Comprehensive architecture documentation based on Next.js 15+ best practices for large-scale applications (2025).

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [App Router Patterns](#app-router-patterns)
3. [Component Architecture](#component-architecture)
4. [Data Fetching Patterns](#data-fetching-patterns)
5. [Server Actions & Validation](#server-actions--validation)
6. [Authentication Patterns](#authentication-patterns)
7. [Database Patterns](#database-patterns)
8. [State Management](#state-management)
9. [Performance Optimization](#performance-optimization)
10. [Error Handling](#error-handling)

---

## Project Structure

### Current Structure (Aligned with Best Practices)

```
ApsaraMenu/
├── .github/                 # GitHub workflows & templates
├── .husky/                  # Git hooks (lint, format, commitlint)
├── .serena/                 # AI agent memories & config
├── prisma/                  # Database schema & migrations
├── public/                  # Static assets
├── src/
│   ├── app/                 # App Router (routes & pages)
│   │   ├── (auth)/          # Auth route group (login, register)
│   │   ├── (content)/       # Content pages route group
│   │   ├── [subdomain]/     # Dynamic subdomain routes
│   │   ├── api/             # API routes
│   │   ├── dashboard/       # Protected dashboard routes
│   │   ├── menu-editor/     # Menu editor feature
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   └── providers.tsx    # App-wide providers
│   ├── components/          # React components
│   │   ├── ui/              # Base UI components (Shadcn)
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── marketing/       # Marketing page components
│   │   └── menu-editor/     # Menu editor components
│   ├── emails/              # React Email templates
│   ├── generated/           # Auto-generated types
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities & helpers
│   │   ├── auth.ts          # Auth configuration
│   │   ├── auth-client.ts   # Client-side auth
│   │   ├── prisma.ts        # Prisma client singleton
│   │   └── utils.ts         # Utility functions
│   ├── server/              # Server-side logic
│   │   ├── actions/         # Server actions
│   │   └── queries/         # Database queries
│   ├── env.mjs              # Environment validation (Zod)
│   ├── proxy.ts             # Next.js 16 proxy (auth redirects)
│   └── instrumentation.ts   # Sentry instrumentation
├── AGENTS.md                # AI agent guidelines
├── package.json
└── tsconfig.json
```

### Key Principles

| Principle                  | Implementation                                                |
| -------------------------- | ------------------------------------------------------------- |
| **Separation of Concerns** | `src/` houses all source code; config at root                 |
| **Feature Colocation**     | Feature components live near their routes                     |
| **Flat Structure**         | Max 3-4 levels deep; avoid excessive nesting                  |
| **Route Groups**           | Use `(groupName)` for logical organization without URL impact |

---

## App Router Patterns

### Route Organization

```
src/app/
├── (auth)/                  # Public auth pages (no /auth in URL)
│   ├── login/page.tsx       # → /login
│   ├── register/page.tsx    # → /register
│   └── layout.tsx           # Auth-specific layout
├── (content)/               # Marketing/content pages
│   ├── about/page.tsx       # → /about
│   └── pricing/page.tsx     # → /pricing
├── dashboard/               # Protected area
│   ├── layout.tsx           # Dashboard layout with sidebar
│   ├── page.tsx             # → /dashboard
│   ├── menu-items/          # → /dashboard/menu-items
│   └── settings/            # → /dashboard/settings
├── api/                     # API routes
│   ├── auth/[...all]/       # Auth API (better-auth)
│   └── webhooks/            # Webhook handlers
└── [subdomain]/             # Dynamic subdomain handling
```

### Layout Hierarchy

```typescript
// src/app/layout.tsx - Root layout (applies to ALL pages)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

// src/app/dashboard/layout.tsx - Dashboard layout (nested)
export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

### Route Groups Best Practices

```typescript
// Use route groups for:
// 1. Logical organization without URL impact
src /
  app /
  marketing / // Marketing pages
  src /
  app /
  auth / // Auth pages
  src /
  app /
  dashboard / // Dashboard (if needed)
  // 2. Different layouts per group
  src /
  app /
  marketing /
  layout.tsx // Full-width layout
src / app / auth / layout.tsx // Centered card layout
```

---

## Component Architecture

### Three-Tier Component Structure

```
src/components/
├── ui/                      # Tier 1: Base UI (Shadcn)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── form.tsx
├── layout/                  # Tier 2: Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   └── sidebar.tsx
└── features/                # Tier 3: Feature components
    ├── auth/
    │   ├── login-form.tsx
    │   └── register-form.tsx
    ├── dashboard/
    │   ├── stats-card.tsx
    │   └── recent-activity.tsx
    └── menu/
        ├── menu-card.tsx
        └── item-form.tsx
```

### Component File Structure

```typescript
// components/features/menu/menu-card.tsx

// 1. Imports
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

// 2. Types
interface MenuCardProps {
  menu: Menu;
  onEdit: (id: string) => void;
}

// 3. Component
export function MenuCard({ menu, onEdit }: MenuCardProps) {
  return (
    <Card>
      {/* ... */}
    </Card>
  );
}

// 4. Subcomponents (if needed)
function MenuCardHeader({ title }: { title: string }) {
  return <h3>{title}</h3>;
}
```

### Server vs Client Components

```typescript
// DEFAULT: Server Component (no directive needed)
// ✅ Can fetch data directly, access DB, keep secrets safe
async function MenuList() {
  const menus = await prisma.menu.findMany();
  return <ul>{menus.map(m => <li key={m.id}>{m.name}</li>)}</ul>;
}

// CLIENT: Only when needed for interactivity
// ⚠️ Use sparingly, keep small
'use client';

import { useState } from 'react';

function MenuFilter() {
  const [filter, setFilter] = useState('');
  return <input value={filter} onChange={e => setFilter(e.target.value)} />;
}
```

### Composition Pattern

```typescript
// Pass Server Components as children to Client Components
// src/app/dashboard/page.tsx

import { Modal } from '@/components/ui/modal';      // Client
import { MenuList } from '@/components/menu-list';   // Server

export default function DashboardPage() {
  return (
    <Modal trigger={<Button>View Menus</Button>}>
      <MenuList />  {/* Server component inside client modal */}
    </Modal>
  );
}
```

---

## Data Fetching Patterns

### Server-Side Fetching (Preferred)

```typescript
// src/app/dashboard/menus/page.tsx
import { prisma } from '@/lib/prisma';

export default async function MenusPage() {
  // Direct database access in Server Component
  const menus = await prisma.menu.findMany({
    where: { organizationId: 'org_123' },
    include: { items: true },
  });

  return <MenuGrid menus={menus} />;
}
```

### Parallel Data Fetching

```typescript
// ✅ Parallel - faster
async function Dashboard() {
  const [menus, stats, activity] = await Promise.all([
    getMenus(),
    getStats(),
    getRecentActivity(),
  ]);

  return (
    <>
      <StatsCards stats={stats} />
      <MenuList menus={menus} />
      <ActivityFeed activity={activity} />
    </>
  );
}

// ❌ Sequential - slower (waterfall)
async function Dashboard() {
  const menus = await getMenus();
  const stats = await getStats();        // Waits for menus
  const activity = await getRecentActivity(); // Waits for stats
}
```

### Streaming with Suspense

```typescript
// src/app/dashboard/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      {/* Instant - static content */}
      <h1>Dashboard</h1>

      {/* Stream in as ready */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards />
      </Suspense>

      <Suspense fallback={<MenusSkeleton />}>
        <RecentMenus />
      </Suspense>
    </div>
  );
}
```

### Request Memoization

```typescript
// lib/queries/menu.ts
import { cache } from "react"

import { prisma } from "@/lib/prisma"

// Automatically deduplicated across component tree
export const getMenu = cache(async (id: string) => {
  return prisma.menu.findUnique({ where: { id } })
})

// Can be called multiple times in different components
// Only executes once per request
```

### Client-Side Fetching (When Needed)

```typescript
// Use TanStack Query for client-side data
'use client';

import { useQuery } from '@tanstack/react-query';

function MenuSearch() {
  const { data, isLoading } = useQuery({
    queryKey: ['menus', searchTerm],
    queryFn: () => fetch(`/api/menus?q=${searchTerm}`).then(r => r.json()),
  });

  return isLoading ? <Spinner /> : <MenuList menus={data} />;
}
```

---

## Server Actions & Validation

### Using next-safe-action (Project Standard)

```typescript
// src/server/actions/menu.ts
"use server"

import { z } from "zod"

import { actionClient } from "@/lib/safe-action"

const createMenuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  locationId: z.string().uuid()
})

export const createMenu = actionClient
  .schema(createMenuSchema)
  .action(async ({ parsedInput }) => {
    const menu = await prisma.menu.create({
      data: parsedInput
    })

    revalidatePath("/dashboard/menus")
    return { success: true, menu }
  })
```

### Form Integration with React Hook Form

```typescript
// components/features/menu/create-menu-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { createMenu } from '@/server/actions/menu';

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export function CreateMenuForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const { execute, status } = useAction(createMenu, {
    onSuccess: () => {
      toast.success('Menu created!');
      form.reset();
    },
    onError: (error) => {
      toast.error(error.serverError || 'Something went wrong');
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(execute)}>
        <FormField name="name" control={form.control} />
        <Button type="submit" disabled={status === 'executing'}>
          {status === 'executing' ? 'Creating...' : 'Create Menu'}
        </Button>
      </form>
    </Form>
  );
}
```

### Shared Zod Schemas

```typescript
// src/lib/validations/menu.ts
import { z } from "zod"

// Shared between client & server
export const menuSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  isActive: z.boolean().default(true)
})

export type MenuInput = z.infer<typeof menuSchema>
```

---

## Authentication Patterns

### better-auth Configuration

```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

import { prisma } from "./prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite" // Turso
  }),
  emailAndPassword: {
    enabled: true
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7 // 7 days
  }
})
```

### Proxy-Based Redirects (Next.js 16+)

```typescript
// src/proxy.ts
import { getSessionCookie } from "better-auth/cookies"
import { NextRequest, NextResponse } from "next/server"

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const { pathname } = request.nextUrl

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect logged-in users away from auth pages
  if (pathname.startsWith("/login") && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"]
}
```

### Server-Side Session Check

```typescript
// src/lib/auth-utils.ts
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

// Usage in Server Component
export default async function DashboardPage() {
  const session = await requireAuth();
  return <div>Welcome, {session.user.name}</div>;
}
```

### Data Access Layer (DAL) Pattern

```typescript
// src/server/dal/menu.ts
import { requireAuth } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function getUserMenus() {
  const session = await requireAuth()

  return prisma.menu.findMany({
    where: {
      organization: {
        members: {
          some: { userId: session.user.id }
        }
      }
    }
  })
}

// Every DAL function verifies auth - single source of truth
```

---

## Database Patterns

### Prisma Client Singleton

```typescript
// src/lib/prisma.ts
import { createClient } from "@libsql/client"
import { PrismaLibSQL } from "@prisma/adapter-libsql"
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN
  })

  const adapter = new PrismaLibSQL(libsql)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
```

### Query Optimization

```typescript
// ✅ Select only needed fields
const menus = await prisma.menu.findMany({
  select: {
    id: true,
    name: true,
    itemCount: true
  }
})

// ✅ Always paginate
const menus = await prisma.menu.findMany({
  take: 20,
  skip: page * 20,
  cursor: lastId ? { id: lastId } : undefined
})

// ✅ Use transactions for related operations
await prisma.$transaction([
  prisma.menu.create({ data: menuData }),
  prisma.auditLog.create({ data: { action: "MENU_CREATED" } })
])

// ❌ Avoid N+1 queries
// Bad: fetching items separately for each menu
const menus = await prisma.menu.findMany()
for (const menu of menus) {
  menu.items = await prisma.item.findMany({ where: { menuId: menu.id } })
}

// ✅ Use includes instead
const menus = await prisma.menu.findMany({
  include: { items: true }
})
```

---

## State Management

### URL State with nuqs (Project Standard)

```typescript
// src/app/dashboard/menus/page.tsx
import { parseAsString, useQueryState } from "nuqs"

export default function MenusPage() {
  const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""))
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withDefault("name")
  )

  // URL updates automatically: /dashboard/menus?q=pizza&sort=created
}
```

### Client State with Jotai

```typescript
// src/stores/menu-editor.ts
import { selectedItemAtom } from "@/stores/menu-editor"
import { atom, useAtom } from "jotai"

export const selectedItemAtom = atom<string | null>(null)
export const isDraggingAtom = atom(false)
export const editorModeAtom = atom<"edit" | "preview">("edit")

// Usage
;("use client")

function ItemSelector() {
  const [selected, setSelected] = useAtom(selectedItemAtom)
  // ...
}
```

### When to Use What

| State Type       | Solution         | Example                     |
| ---------------- | ---------------- | --------------------------- |
| **URL State**    | nuqs             | Filters, search, pagination |
| **Server State** | TanStack Query   | Cached API responses        |
| **UI State**     | Jotai / useState | Modals, selections, forms   |
| **Form State**   | React Hook Form  | Form inputs, validation     |

---

## Performance Optimization

### Image Optimization

```typescript
import Image from 'next/image';

// ✅ Always use next/image
<Image
  src={menu.image}
  alt={menu.name}
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL={menu.blurHash}
  loading="lazy"  // Default, explicit for clarity
/>

// For dynamic images, configure remotePatterns in next.config.mjs
```

### Dynamic Imports

```typescript
import dynamic from 'next/dynamic';

// Heavy components loaded only when needed
const MenuEditor = dynamic(() => import('@/components/menu-editor'), {
  loading: () => <EditorSkeleton />,
  ssr: false,  // Client-only component
});

// Code splitting for routes happens automatically with App Router
```

### Bundle Analysis

```bash
# Analyze bundle size
ANALYZE=true bun run build

# Check for large dependencies
npx @next/bundle-analyzer
```

---

## Error Handling

### Error Boundaries

```typescript
// src/app/dashboard/error.tsx
'use client';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-4">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

### Global Error Handler

```typescript
// src/app/global-error.tsx
'use client';

import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
}: {
  error: Error;
}) {
  Sentry.captureException(error);

  return (
    <html>
      <body>
        <h1>Something went wrong!</h1>
      </body>
    </html>
  );
}
```

### Server Action Error Handling

```typescript
// With next-safe-action, errors are typed and predictable
const { execute, status, result } = useAction(createMenu)

// result.serverError - Server-side errors
// result.validationErrors - Zod validation errors
// result.data - Success data
```

---

## Sources

- [Next.js 15 Project Structure Best Practices](https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji)
- [Next.js Official Docs: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Data Fetching Patterns](https://nextjs.org/docs/14/app/building-your-application/data-fetching/patterns)
- [better-auth Next.js Integration](https://www.better-auth.com/docs/integrations/next)
- [Next.js Enterprise Architecture](https://medium.com/@vyakymenko/enterprise-next-js-application-architecture-with-nx-vitest-c453dbd94f0a)
- [Server Actions with next-safe-action](https://www.davegray.codes/posts/nextjs-server-actions-with-next-safe-action)
- [Prisma Production Guide](https://www.digitalapplied.com/blog/prisma-orm-production-guide-nextjs)
- [Next.js Caching Guide](https://nextjs.org/docs/app/guides/caching)

---

_Last updated: December 2025_
