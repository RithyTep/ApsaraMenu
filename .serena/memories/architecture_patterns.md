# Architecture Patterns Reference

## Project Structure

- `src/` contains all source code
- Route groups: `(auth)`, `(content)` for logical organization
- Components: `ui/` → `layout/` → `features/` hierarchy
- Server logic in `src/server/actions/` and `src/server/queries/`

## Key Patterns

### Data Fetching

- Server Components fetch directly from Prisma
- Use `Promise.all()` for parallel fetches
- Stream with `<Suspense>` for progressive loading
- Use `cache()` from React for request memoization

### Server Actions

- Use `next-safe-action` for type-safe mutations
- Share Zod schemas between client/server
- React Hook Form + zodResolver for forms

### Authentication

- `better-auth` with Prisma adapter
- Proxy-based redirects (Next.js 16+)
- DAL pattern: auth check in every data function
- `getSessionCookie()` for fast optimistic checks

### State Management

- URL state: nuqs
- Server state: TanStack Query
- UI state: Jotai / useState
- Form state: React Hook Form

### Database

- Prisma singleton with globalThis pattern
- Always paginate queries
- Use transactions for related operations
- Select only needed fields

## Files Reference

- `docs/ARCHITECTURE.md` - Full architecture guide
- `AGENTS.md` - AI agent guidelines
- `src/lib/auth.ts` - Auth configuration
- `src/lib/prisma.ts` - Database client
