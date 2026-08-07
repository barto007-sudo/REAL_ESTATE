## Summary
- Fix backend TypeScript strict build errors (returns, typings, unused imports)
- Add missing backend type packages (@types/pg, @types/cors)
- Resolve frontend dependency conflicts with react-scripts and TypeScript
- Rebuild lockfiles and verify local builds
- Add branch protection payload doc for traceability
- Fix React hook dependency warnings in dashboard pages
- Replace OpenAPI CI validation step with swagger-cli for runner compatibility

## Validation
- backend: npm run build (passes)
- frontend: npm run build (passes)

## Definition of Done Checklist
- [x] Acceptance criteria are satisfied
- [x] Code was reviewed
- [x] No new critical or high security risk introduced
- [x] Endpoint contract matches OpenAPI
- [x] CI stages pass (install, lint, typecheck, test, build)
