# Task Completion Checklist

## Before Marking a Task Complete

### Code Quality

- [ ] `bun run typecheck` passes (no TypeScript errors)
- [ ] `bun run lint` passes (no ESLint errors)
- [ ] No `any` types introduced
- [ ] Code follows existing patterns

### Testing

- [ ] Manually tested the feature/fix
- [ ] Edge cases considered
- [ ] No console errors in browser

### Performance

- [ ] Server Components used where possible
- [ ] No unnecessary `use client` directives
- [ ] No large dependencies added to client bundle

### Security

- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Auth checks on protected routes

### Database (if applicable)

- [ ] Schema changes have migrations
- [ ] `prisma generate` run after schema changes
- [ ] Queries are efficient (no N+1)

### Git

- [ ] Changes committed with conventional commit message
- [ ] Relevant files staged (no unintended changes)
- [ ] Branch name follows pattern: feature/_, fix/_, refactor/\*

## Quick Commands

```bash
bun run typecheck && bun run lint
```
