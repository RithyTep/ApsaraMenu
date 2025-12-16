# Suggested Commands for ApsaraMenu Development

## Development

```bash
bun run dev          # Start dev server (Turbopack)
bun run db:dev       # Start local Turso database
bun run stripe:listen # Forward Stripe webhooks
bun run email        # Email preview server
```

## Code Quality

```bash
bun run typecheck    # TypeScript type checking
bun run lint         # ESLint checks
bun run lint:fix     # ESLint with auto-fix
bun run format       # Prettier formatting
```

## Build & Production

```bash
bun run build        # Production build
bun run start        # Start production server
```

## Database

```bash
bun run prisma:migrate  # Apply migrations
prisma generate         # Generate Prisma client
prisma studio           # Open Prisma Studio GUI
```

## Git Workflow

```bash
# Commit format (Conventional Commits)
git commit -m "feat(scope): description"
git commit -m "fix(scope): description"

# Types: feat, fix, docs, style, refactor, perf, test, chore, ci
# Scopes: auth, api, ui, db, menu, location, payment
```

## System Commands (macOS/Darwin)

```bash
ls -la              # List files with details
find . -name "*.ts" # Find TypeScript files
grep -r "pattern"   # Search in files
cd /path            # Change directory
```
