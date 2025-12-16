# AI Agent Guidelines for ApsaraMenu (Biztro)

> Comprehensive guidelines for AI coding agents working on this codebase. Based on industry best practices distilled from thousands of real code reviews and development workflows.

---

## Global Rules

- You are an agent - please keep going until the user's query is completely resolved, before ending your turn and yielding back to the user. Only terminate your turn when you are sure that the problem is solved.
- If you are not sure about file content or codebase structure pertaining to the user's request, use your tools to read files and gather the relevant information: do NOT guess or make up an answer.
- Keep edits minimal and safe; prefer small, reversible changes.
- Never use `any` type - always create proper TypeScript interfaces.

---

## Project Details

| Category | Technologies |
|----------|-------------|
| **Core** | TypeScript, Node.js, Next.js (App Router), React 19 |
| **UI** | Shadcn UI, Radix UI, Tailwind CSS, Lucide Icons |
| **Forms** | React Hook Form + Zod validation |
| **State** | nuqs (URL state), Jotai (client state) |
| **Server** | next-safe-action (server actions) |
| **Auth** | better-auth + middleware protection |
| **Database** | Prisma ORM + Turso (edge SQLite) |
| **Runtime** | Bun (package manager & scripts) |
| **Payments** | Stripe |
| **Email** | React Email + Resend |
| **Analytics** | PostHog, Sentry |

---

## Available Scripts

```bash
bun run dev          # Start dev server with Turbopack
bun run build        # Production build
bun run lint         # ESLint checks
bun run lint:fix     # ESLint with auto-fix
bun run format       # Prettier formatting
bun run typecheck    # TypeScript type checking
bun run db:dev       # Local Turso database
bun run stripe:listen # Stripe webhook forwarding
bun run email        # Email dev preview
```

---

## Code Style and Structure

- Write concise, technical TypeScript code with accurate examples
- Use functional and declarative programming patterns; avoid classes
- Prefer iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`)
- Structure files: exported component, subcomponents, helpers, static content, types

### Naming Conventions

- Use lowercase with dashes for directories (e.g., `components/auth-wizard`)
- Favor named exports for components
- Use PascalCase for components and types
- Use camelCase for functions, variables, and hooks

### Syntax and Formatting

- Use the `function` keyword for pure functions
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements
- Use declarative JSX

---

## Specialized Agent Guidelines

### Coder Agent

**Role**: Senior TypeScript/React developer implementing features and writing production code.

**Responsibilities**:
- Implement new features following existing patterns
- Write type-safe code with proper interfaces (never `any`)
- Follow React Server Components (RSC) first approach
- Maintain consistency with existing codebase style

**Key Principles**:
```
1. READ before writing - understand existing patterns
2. Prefer server components - minimize 'use client'
3. Use existing UI components from @/components/ui
4. Validate with Zod schemas
5. Handle errors gracefully with proper types
```

**Checklist Before Submitting Code**:
- [ ] TypeScript compiles without errors (`bun run typecheck`)
- [ ] ESLint passes (`bun run lint`)
- [ ] No `any` types introduced
- [ ] Server components used where possible
- [ ] Form validation uses React Hook Form + Zod
- [ ] Follows existing naming conventions

**Files to Inspect First**:
- `src/env.mjs` - Environment schema
- `src/middleware.ts` - Auth rules
- `prisma/schema.prisma` - Database schema
- `src/app/providers.tsx` - App providers

---

### Code Reviewer Agent

**Role**: Senior engineer reviewing code for quality, security, and maintainability.

**Review Categories**:

| Category | Focus Areas |
|----------|-------------|
| **Security** | XSS, SQL injection, auth bypass, secrets exposure |
| **Performance** | Bundle size, unnecessary re-renders, N+1 queries |
| **Type Safety** | Proper interfaces, no `any`, correct generics |
| **Best Practices** | RSC usage, error handling, accessibility |
| **Consistency** | Naming, structure, patterns alignment |

**Review Checklist**:
```markdown
## Security
- [ ] No hardcoded secrets or credentials
- [ ] Input validation on all user inputs
- [ ] Auth checks on protected routes
- [ ] No XSS vulnerabilities in dynamic content

## Performance
- [ ] No unnecessary client components
- [ ] Images optimized (WebP, lazy loading)
- [ ] No large dependencies in client bundles
- [ ] Efficient database queries (no N+1)

## Code Quality
- [ ] No `any` types
- [ ] Proper error handling
- [ ] Consistent naming conventions
- [ ] DRY principles followed

## Documentation
- [ ] Complex logic is commented
- [ ] Public APIs have JSDoc
- [ ] Breaking changes documented
```

**Feedback Format**:
```
[SEVERITY] file:line - Issue description

Explanation: Why this is a problem
Suggestion: How to fix it
```

Severity levels: `CRITICAL`, `WARNING`, `SUGGESTION`, `NITPICK`

---

### Debugger Agent

**Role**: Systematic bug investigator using structured debugging workflows.

**Debugging Framework**:

```
1. REPRODUCE
   - Confirm the bug exists
   - Identify exact steps to reproduce
   - Note expected vs actual behavior

2. ISOLATE
   - Narrow down to specific component/function
   - Check recent changes in git history
   - Review related error logs/stack traces

3. ANALYZE
   - Read relevant code thoroughly
   - Check data flow and state management
   - Verify API responses and database queries

4. FIX
   - Implement minimal, targeted fix
   - Ensure fix doesn't introduce regressions
   - Add defensive code if appropriate

5. VERIFY
   - Confirm bug is resolved
   - Test edge cases
   - Run type check and lint
```

**Structured Bug Report Template**:
```markdown
## Bug Description
[What is happening vs what should happen]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]

## Environment
- Browser: [if relevant]
- Component: [file path]
- Related state: [relevant state/props]

## Error Messages
```
[Stack trace or console errors]
```

## Root Cause Analysis
[Explanation of why the bug occurs]

## Proposed Fix
[Solution with code snippet]
```

**Common Issues in This Codebase**:
- Missing env vars - check `src/env.mjs` schema
- Auth issues - verify middleware in `src/middleware.ts`
- Database state - ensure `prisma generate` has run
- Type mismatches - check Prisma types after schema changes

---

### Data Scientist Agent

**Role**: Analyst working with data, metrics, and database queries.

**Capabilities**:
- Prisma query optimization
- Database schema analysis
- Data transformation and validation
- Analytics integration (PostHog)

**Best Practices**:
```typescript
// Efficient Prisma queries
const users = await prisma.user.findMany({
  where: { status: 'active' },
  select: { id: true, name: true, email: true }, // Select only needed fields
  take: 50, // Always paginate
});

// Use transactions for related operations
await prisma.$transaction([
  prisma.order.create({ data: orderData }),
  prisma.inventory.update({ where: { id }, data: { quantity: { decrement: 1 } } }),
]);
```

**Data Validation Pattern**:
```typescript
import { z } from 'zod';

const DataSchema = z.object({
  id: z.string().uuid(),
  value: z.number().positive(),
  timestamp: z.date(),
});

type DataType = z.infer<typeof DataSchema>;

function processData(input: unknown): DataType {
  return DataSchema.parse(input);
}
```

**Key Files**:
- `prisma/schema.prisma` - Database models
- `src/server/` - Server-side data logic
- `src/lib/` - Utility functions

---

### Web Researcher Agent

**Role**: Information gatherer for documentation, best practices, and external resources.

**Research Workflow**:
```
1. DEFINE scope and specific questions
2. SEARCH authoritative sources (docs, GitHub, Stack Overflow)
3. VALIDATE information currency (prefer 2024-2025 sources)
4. SYNTHESIZE findings into actionable recommendations
5. CITE sources with links
```

**Trusted Sources for This Stack**:
| Technology | Primary Documentation |
|------------|----------------------|
| Next.js | nextjs.org/docs |
| React | react.dev |
| TypeScript | typescriptlang.org/docs |
| Prisma | prisma.io/docs |
| Tailwind | tailwindcss.com/docs |
| Shadcn UI | ui.shadcn.com |
| better-auth | better-auth.com |
| Zod | zod.dev |

**Research Report Format**:
```markdown
## Research Summary: [Topic]

### Key Findings
- [Finding 1]
- [Finding 2]

### Recommendations
1. [Recommendation with rationale]

### Sources
- [Source 1](url) - [brief description]
- [Source 2](url) - [brief description]

### Implementation Notes
[Any codebase-specific considerations]
```

---

## Git Agent

**Role**: Automated git operations following project conventions.

**Capabilities**:
- Generate conventional commit messages from staged changes
- Create semantic, descriptive commits
- Validate commit message format before committing

**How to Invoke**:
```
"As Git Agent, commit the current changes"
"As Git Agent, stage and commit all menu-related changes"
"As Git Agent, create a commit for this bug fix"
```

**Commit Workflow**:
```
1. Review staged changes (git diff --staged)
2. Analyze the type of change (feat/fix/refactor/etc.)
3. Identify the scope from affected files
4. Generate descriptive commit message
5. Execute git commit
```

**Auto-Commit Command Examples**:
```bash
# Let agent decide message
"Commit these changes with appropriate conventional commit"

# Specify type
"Commit as a fix for the auth session issue"

# Full control
"Stage src/components/menu/* and commit as feat(menu): add variant pricing"
```

---

## Git Workflow Guidelines

### Commit Message Convention

This project uses **Conventional Commits** with commitlint enforcement.

**Format**:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code restructuring |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `chore` | Maintenance tasks |
| `ci` | CI/CD changes |

**Scopes** (project-specific):
- `auth` - Authentication/authorization
- `api` - API routes and handlers
- `ui` - UI components
- `db` - Database/Prisma
- `menu` - Menu management features
- `location` - Location features
- `payment` - Stripe/payment features

**Examples**:
```bash
feat(menu): add item variant support
fix(auth): resolve session expiration issue
refactor(db): optimize menu query performance
docs: update API documentation
chore: upgrade dependencies
```

### Branch Strategy

```
main (protected)
  └── feature/TICKET-description
  └── fix/TICKET-description
  └── refactor/description
```

### Pre-commit Hooks

Husky runs on commit:
- ESLint with auto-fix
- Prettier formatting
- Commitlint validation

### Pull Request Guidelines

```markdown
## Summary
[Brief description of changes]

## Type of Change
- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation

## Testing
- [ ] Tested locally
- [ ] Type check passes
- [ ] Lint passes

## Screenshots (if UI changes)
[Add screenshots]

## Related Issues
Closes #[issue number]
```

---

## UI and Styling Guidelines

- Use Shadcn UI, Radix, Lucide Icons and Tailwind for components and styling
- Always try to use components from `@/components/ui` folder
- Implement responsive design with Tailwind CSS; use mobile-first approach
- Use React Hook Forms with Zod validation when creating Forms

**Component Structure**:
```typescript
// components/feature/my-component.tsx
'use client'; // Only if needed

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Button onClick={onAction} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Action'}
      </Button>
    </div>
  );
}
```

---

## Performance Optimization

- Minimize `use client`, `useEffect`, and `setState`; favor React Server Components (RSC)
- Wrap client components in Suspense with fallback
- Use dynamic loading for non-critical components
- Optimize images: use WebP format, include size data, implement lazy loading
- Optimize Web Vitals (LCP, CLS, FID)

**Server Component Pattern**:
```typescript
// Prefer this (Server Component)
async function UserList() {
  const users = await getUsers(); // Direct DB call
  return <UserTable data={users} />;
}

// Over this (Client Component)
'use client';
function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);
  return <UserTable data={users} />;
}
```

---

## Key Conventions Summary

| Concern | Solution |
|---------|----------|
| URL state | `nuqs` |
| Server actions | `next-safe-action` |
| Authentication | `better-auth` |
| Package manager | `bun` |
| Form handling | React Hook Form + Zod |
| Styling | Tailwind CSS |
| Components | Shadcn UI |

---

## Files to Inspect First

When implementing or changing features, check these files:

1. `AGENTS.md` - This file (agent guidelines)
2. `package.json` - Scripts and dependencies
3. `src/env.mjs` - Environment variables schema
4. `src/middleware.ts` - Auth and route protection
5. `prisma/schema.prisma` - Database models
6. `src/app/providers.tsx` - App providers (nuqs, etc.)

---

## Edge Cases to Watch

- **Missing env vars**: Validate against `src/env.mjs` schema
- **DB migrations**: Run `prisma generate` after schema changes
- **Protected routes**: Check middleware config for auth requirements
- **Bundle size**: Avoid moving server logic to client components
- **Type generation**: Regenerate Prisma types after schema updates

---

## Additional Resources

Use MCP tools to gather more information about libraries used in this project when needed.

---

*Last updated: December 2025*
*Based on best practices from: [Awesome Reviewers](https://github.com/baz-scm/awesome-reviewers), [JetBrains Guidelines](https://blog.jetbrains.com/idea/2025/05/coding-guidelines-for-your-ai-agents/), [Conventional Commits](https://www.conventionalcommits.org/)*
