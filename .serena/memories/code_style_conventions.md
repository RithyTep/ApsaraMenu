# Code Style and Conventions

## TypeScript Rules

- **No `any` type** - always create proper interfaces
- Use `function` keyword for pure functions
- Prefer `const` over `let`
- Use strict null checks

## Naming Conventions

- **Directories**: lowercase-with-dashes (e.g., `auth-wizard`)
- **Components**: PascalCase (e.g., `MenuCard`)
- **Functions/Variables**: camelCase with auxiliary verbs (e.g., `isLoading`, `hasError`)
- **Types/Interfaces**: PascalCase (e.g., `MenuItemProps`)

## File Structure

```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Component
// 4. Subcomponents
// 5. Helpers
// 6. Static content
```

## React Patterns

- Prefer Server Components (no `use client` unless needed)
- Wrap client components in Suspense
- Use React Hook Form + Zod for forms
- Use nuqs for URL state management

## Component Template

```typescript
// Only if client-side needed
'use client';

import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
```

## Commit Messages

Format: `<type>(<scope>): <description>`

Types: feat, fix, docs, style, refactor, perf, test, chore, ci
Scopes: auth, api, ui, db, menu, location, payment
