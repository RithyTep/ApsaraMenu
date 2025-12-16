# ApsaraMenu Refactoring Plan

> Comprehensive plan to align the existing codebase with best practices documented in `docs/ARCHITECTURE.md` and `AGENTS.md`.

---

## Executive Summary

### Current State Analysis

| Area                  | Current Status                    | Gap                                            |
| --------------------- | --------------------------------- | ---------------------------------------------- |
| **Project Structure** | Good - `src/` organization exists | Minor - some files in app/ could be components |
| **Server Actions**    | Good - using next-safe-action     | Minor - some inconsistent patterns             |
| **Components**        | Mixed - flat structure            | Medium - needs 3-tier reorganization           |
| **Type Safety**       | Good - minimal `any` usage        | Minor - some implicit types                    |
| **Data Fetching**     | Mixed                             | Medium - some client fetching could be server  |
| **Validation**        | Good - Zod schemas exist          | Minor - not all shared                         |
| **Error Handling**    | Partial                           | Medium - needs standardization                 |

### Priority Levels

- **P0 (Critical)**: Security, data integrity issues
- **P1 (High)**: Performance, maintainability blockers
- **P2 (Medium)**: Code organization, consistency
- **P3 (Low)**: Nice-to-have improvements

---

## Phase 1: Component Architecture Reorganization

**Priority**: P2 | **Effort**: Medium | **Risk**: Low

### Current Structure

```
src/components/
├── ui/                  ✅ Good - Shadcn components
├── dashboard/           ⚠️ Mixed concerns
├── marketing/           ⚠️ Mixed concerns
├── menu-editor/         ✅ Feature-specific
├── data-table/          ✅ Reusable
├── magicui/             ✅ UI library
├── flare-ui/            ✅ UI library
├── kibo-ui/             ✅ UI library
└── icons/               ✅ Icon components
```

### Target Structure

```
src/components/
├── ui/                  # Tier 1: Base UI (keep as-is)
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── layout/              # Tier 2: Layout components (NEW)
│   ├── header.tsx
│   ├── footer.tsx
│   ├── sidebar.tsx
│   └── page-header.tsx
├── features/            # Tier 3: Feature components (REORGANIZE)
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── dashboard/
│   │   ├── stats-card.tsx
│   │   └── menu-card.tsx
│   ├── menu/
│   │   ├── menu-list.tsx
│   │   ├── menu-create.tsx
│   │   └── menu-delete.tsx
│   ├── menu-items/
│   │   ├── item-form.tsx
│   │   ├── item-table.tsx
│   │   └── category-list.tsx
│   ├── settings/
│   │   ├── organization-form.tsx
│   │   ├── members-table.tsx
│   │   └── billing-view.tsx
│   └── menu-editor/     # Keep existing
│       └── ...
├── shared/              # Cross-feature components (NEW)
│   ├── file-uploader.tsx
│   ├── data-table/
│   └── confetti.tsx
└── icons/               # Keep as-is
```

### Tasks

1. [ ] Create `src/components/layout/` directory
2. [ ] Extract layout components from dashboard/marketing
3. [ ] Create `src/components/features/` directory
4. [ ] Move feature-specific components from `src/app/` to `src/components/features/`
5. [ ] Create `src/components/shared/` for cross-cutting components
6. [ ] Update all imports

### Files to Move

| From                                         | To                                             |
| -------------------------------------------- | ---------------------------------------------- |
| `src/app/dashboard/menu-create.tsx`          | `src/components/features/menu/menu-create.tsx` |
| `src/app/dashboard/menu-delete.tsx`          | `src/components/features/menu/menu-delete.tsx` |
| `src/app/dashboard/menu-list.tsx`            | `src/components/features/menu/menu-list.tsx`   |
| `src/app/dashboard/menu-rename.tsx`          | `src/components/features/menu/menu-rename.tsx` |
| `src/app/dashboard/menu-items/item-*.tsx`    | `src/components/features/menu-items/`          |
| `src/app/dashboard/settings/*.tsx`           | `src/components/features/settings/`            |
| `src/components/dashboard/file-uploader.tsx` | `src/components/shared/file-uploader.tsx`      |

---

## Phase 2: Server Logic Reorganization

**Priority**: P2 | **Effort**: Medium | **Risk**: Low

### Current Structure

```
src/server/actions/
├── organization/
│   ├── queries.ts      # Data fetching
│   └── mutations.ts    # Server actions
├── location/
├── user/
├── subscriptions/
├── item/
└── menu/
```

### Target Structure

```
src/server/
├── actions/             # Server Actions (mutations)
│   ├── menu.ts
│   ├── item.ts
│   ├── organization.ts
│   ├── location.ts
│   ├── user.ts
│   └── subscription.ts
├── queries/             # Data Fetching (SEPARATE)
│   ├── menu.ts
│   ├── item.ts
│   ├── organization.ts
│   └── ...
├── dal/                 # Data Access Layer (NEW)
│   ├── menu.ts          # Auth-checked data access
│   ├── item.ts
│   └── organization.ts
└── validations/         # Shared Zod schemas (NEW)
    ├── menu.ts
    ├── item.ts
    └── organization.ts
```

### Tasks

1. [ ] Create `src/server/queries/` directory
2. [ ] Move query functions from `*/queries.ts` to dedicated files
3. [ ] Create `src/server/dal/` for auth-wrapped data access
4. [ ] Create `src/server/validations/` for shared Zod schemas
5. [ ] Extract schemas from mutations to validations
6. [ ] Update imports across the codebase

---

## Phase 3: Shared Validation Schemas

**Priority**: P1 | **Effort**: Low | **Risk**: Low

### Current Pattern

```typescript
// Schemas defined inline in mutations
export const createMenu = authMemberActionClient
  .schema(z.object({
    name: z.string().min(1),
    // ...
  }))
  .action(async ({ parsedInput }) => { ... });
```

### Target Pattern

```typescript
// src/server/validations/menu.ts
export const createMenuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  locationId: z.string().uuid(),
});

export type CreateMenuInput = z.infer<typeof createMenuSchema>;

// src/server/actions/menu.ts
import { createMenuSchema } from "../validations/menu";

export const createMenu = authMemberActionClient
  .schema(createMenuSchema)
  .action(async ({ parsedInput }) => { ... });

// src/components/features/menu/menu-create.tsx
import { createMenuSchema, type CreateMenuInput } from "@/server/validations/menu";

const form = useForm<CreateMenuInput>({
  resolver: zodResolver(createMenuSchema),
});
```

### Tasks

1. [ ] Create `src/server/validations/` directory
2. [ ] Extract menu schemas → `src/server/validations/menu.ts`
3. [ ] Extract item schemas → `src/server/validations/item.ts`
4. [ ] Extract organization schemas → `src/server/validations/organization.ts`
5. [ ] Extract location schemas → `src/server/validations/location.ts`
6. [ ] Update all server actions to import from validations
7. [ ] Update all forms to use shared schemas

---

## Phase 4: Data Access Layer (DAL)

**Priority**: P1 | **Effort**: Medium | **Risk**: Low

### Purpose

Centralize auth checks and data access logic to:

- Prevent unauthorized data access
- Single source of truth for data queries
- Easier testing and maintenance

### Implementation

```typescript
// src/server/dal/menu.ts
import { requireAuth, requireMembership } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function getUserMenus() {
  const session = await requireAuth()
  const membership = await requireMembership()

  return prisma.menu.findMany({
    where: {
      organizationId: membership.organizationId
    },
    orderBy: { createdAt: "desc" }
  })
}

export async function getMenuById(id: string) {
  const membership = await requireMembership()

  const menu = await prisma.menu.findUnique({
    where: { id },
    include: { items: true }
  })

  if (!menu || menu.organizationId !== membership.organizationId) {
    throw new Error("Menu not found")
  }

  return menu
}
```

### Tasks

1. [ ] Create `src/lib/auth-utils.ts` with `requireAuth()`, `requireMembership()`
2. [ ] Create `src/server/dal/menu.ts`
3. [ ] Create `src/server/dal/item.ts`
4. [ ] Create `src/server/dal/organization.ts`
5. [ ] Update Server Components to use DAL
6. [ ] Update Server Actions to use DAL for validation

---

## Phase 5: Client Component Optimization

**Priority**: P2 | **Effort**: Medium | **Risk**: Medium

### Current Issues

Many components in `src/app/dashboard/` are client components that could potentially:

1. Be refactored to Server Components
2. Have smaller client boundaries
3. Use composition pattern

### Files to Review

```
src/app/dashboard/
├── menu-list.tsx        # "use client" - review if needed
├── menu-create.tsx      # "use client" - form, keep
├── menu-delete.tsx      # "use client" - dialog, keep
└── menu-rename.tsx      # "use client" - form, keep

src/app/dashboard/menu-items/
├── item-table.tsx       # "use client" - review
├── filter-toolbar.tsx   # "use client" - keep (interactive)
└── columns.tsx          # "use client" - keep (hooks)
```

### Optimization Strategy

```typescript
// BEFORE: Entire component is client
"use client";
export function MenuList() {
  const menus = useQuery(...); // Client-side fetch
  return <div>{menus.map(...)}</div>;
}

// AFTER: Server Component with client islands
// src/app/dashboard/page.tsx (Server)
import { getUserMenus } from "@/server/dal/menu";
import { MenuListClient } from "@/components/features/menu/menu-list-client";

export default async function DashboardPage() {
  const menus = await getUserMenus(); // Server-side fetch
  return <MenuListClient initialMenus={menus} />;
}

// src/components/features/menu/menu-list-client.tsx (Client)
"use client";
export function MenuListClient({ initialMenus }) {
  // Only client logic: filtering, sorting, optimistic updates
}
```

### Tasks

1. [ ] Audit all `"use client"` components in `src/app/`
2. [ ] Identify components that can become Server Components
3. [ ] Refactor data fetching to server where possible
4. [ ] Apply composition pattern for mixed components
5. [ ] Add `<Suspense>` boundaries for streaming

---

## Phase 6: Error Handling Standardization

**Priority**: P1 | **Effort**: Low | **Risk**: Low

### Current State

- `src/app/global-error.tsx` exists ✅
- Route-level error boundaries: Missing ❌
- Server Action error handling: Partial ⚠️

### Tasks

1. [ ] Add `src/app/dashboard/error.tsx` for dashboard errors
2. [ ] Add `src/app/(auth)/error.tsx` for auth errors
3. [ ] Create standard error response format for actions
4. [ ] Add toast notifications for action errors
5. [ ] Implement Sentry error reporting in error boundaries

### Error Boundary Template

```typescript
// src/app/dashboard/error.tsx
"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <h2 className="text-xl font-semibold">Something went wrong!</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

---

## Phase 7: Performance Optimizations

**Priority**: P2 | **Effort**: Medium | **Risk**: Low

### Tasks

1. [ ] Add `loading.tsx` to all route segments
2. [ ] Implement parallel data fetching with `Promise.all()`
3. [ ] Add React `cache()` for repeated queries
4. [ ] Review and optimize Prisma queries (select, pagination)
5. [ ] Add `<Suspense>` boundaries for progressive loading
6. [ ] Audit bundle size with `@next/bundle-analyzer`

### Loading State Template

```typescript
// src/app/dashboard/menu-items/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function MenuItemsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-[200px]" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}
```

---

## Phase 8: Type Safety Improvements

**Priority**: P3 | **Effort**: Low | **Risk**: Low

### Tasks

1. [ ] Audit for implicit `any` types
2. [ ] Add explicit return types to all exported functions
3. [ ] Create shared type definitions in `src/types/`
4. [ ] Use Prisma generated types consistently
5. [ ] Add strict TypeScript config options

### Type Organization

```
src/types/
├── index.ts             # Re-exports
├── menu.ts              # Menu-related types
├── organization.ts      # Org-related types
└── api.ts               # API response types
```

---

## Implementation Order

### Sprint 1 (Foundation)

1. ✅ Phase 3: Shared Validation Schemas
2. ✅ Phase 4: Data Access Layer
3. ✅ Phase 6: Error Handling

### Sprint 2 (Organization)

4. Phase 1: Component Architecture
5. Phase 2: Server Logic Reorganization

### Sprint 3 (Optimization)

6. Phase 5: Client Component Optimization
7. Phase 7: Performance Optimizations
8. Phase 8: Type Safety

---

## Risk Mitigation

| Risk                   | Mitigation                                              |
| ---------------------- | ------------------------------------------------------- |
| Breaking imports       | Use TypeScript to catch errors; run `bun run typecheck` |
| Runtime errors         | Test each phase in isolation before merging             |
| Merge conflicts        | Work on one phase at a time; keep PRs small             |
| Performance regression | Benchmark before/after each phase                       |

---

## Success Metrics

- [ ] Zero TypeScript errors
- [ ] Zero ESLint errors
- [ ] All components follow 3-tier structure
- [ ] All server actions use shared validation schemas
- [ ] All data access goes through DAL
- [ ] Error boundaries on all route segments
- [ ] Bundle size same or smaller
- [ ] Lighthouse score maintained or improved

---

## Commands

```bash
# Validate changes
bun run typecheck
bun run lint
bun run build

# Analyze bundle
ANALYZE=true bun run build

# Test specific phase
git checkout -b refactor/phase-1-components
# Make changes...
bun run typecheck && bun run lint && bun run build
```

---

_Created: December 2025_
_Based on: `docs/ARCHITECTURE.md`, `AGENTS.md`_
