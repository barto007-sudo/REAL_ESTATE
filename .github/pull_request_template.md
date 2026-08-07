## Summary
- What changed?
- Why was this change needed?

## Scope
- Module(s): Dashboard / Properties / Contracts / Tenants / Owners / Payments / Reports / Auth / DevOps
- Type: Feature / Fix / Refactor / Docs / Chore

## Validation
- [ ] Local run completed
- [ ] Unit tests added or updated
- [ ] Integration or smoke tests executed
- [ ] Evidence attached (logs, screenshots, API responses)

## Definition of Done Checklist
### Global
- [ ] Acceptance criteria are satisfied
- [ ] Code was reviewed
- [ ] No new critical or high security risk introduced
- [ ] Error handling and logging are present
- [ ] Rollback impact assessed

### Frontend
- [ ] Route and UI follow master layout standards
- [ ] Responsive behavior validated on desktop, tablet, and mobile
- [ ] Loading, empty, error, and success states covered
- [ ] Forms validate inputs and show clear feedback
- [ ] Accessibility basics checked (keyboard, focus, labels)

### Backend
- [ ] Endpoint contract matches OpenAPI
- [ ] Request validation and typed DTOs implemented
- [ ] Auth and RBAC checks applied where needed
- [ ] DB changes are delivered via migration (up and down)
- [ ] Critical business logic covered by tests

### QA
- [ ] Test cases mapped to acceptance criteria
- [ ] Smoke suite passes
- [ ] No Sev1 or Sev2 defects open for this scope

### DevOps
- [ ] CI stages pass (install, lint, typecheck, test, build)
- [ ] Artifact is versioned and traceable
- [ ] Staging deploy and post-deploy smoke pass completed
- [ ] Production deploy has approval gate and rollback plan
- [ ] Monitoring and alerts updated if needed

## Security
- [ ] Secrets are not hardcoded
- [ ] CORS policy impact reviewed
- [ ] Permissions and data exposure reviewed

## Deployment Notes
- Migration required: Yes / No
- Env vars changed: Yes / No
- Manual steps:
  - Step 1
  - Step 2

## Related
- Jira ticket(s):
- API contract change: docs/api/openapi.yaml
- DoD reference: docs/planning/definition-of-done-template.md
