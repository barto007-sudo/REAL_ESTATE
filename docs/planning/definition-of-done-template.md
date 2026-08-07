# REAL_ESTATE - Definition of Done by Team

## Global DoD (all teams)
- Requirement has clear acceptance criteria.
- Code is peer reviewed and approved.
- No critical/high security issues introduced.
- Logging and error handling are implemented.
- Feature documented in release notes.
- Rollback impact evaluated.

## Frontend DoD
- Route and UI follow master layout standards.
- Responsive behavior verified: desktop, tablet, mobile.
- Loading, empty, error, and success states covered.
- Forms include client validation and clear inline messages.
- API integration handles 2xx, 4xx, 5xx paths.
- Accessibility checks: keyboard nav, semantic labels, focus states.
- Unit tests for critical UI logic are added.

## Backend DoD
- Endpoint contract matches OpenAPI spec.
- Request payload validation and typed DTOs are in place.
- AuthN/AuthZ checks implemented (JWT + RBAC).
- Business rules covered for valid and invalid flows.
- DB changes delivered via migration (up/down) and reviewed.
- Service/repository unit tests added for critical logic.
- Integration tests added for endpoint behavior.

## QA DoD
- Test cases mapped to acceptance criteria.
- Smoke suite updated and passing.
- Regression impact assessed and executed.
- Evidence attached: logs, screenshots, API responses.
- No Sev1/Sev2 defects open for release candidate.

## DevOps DoD
- CI pipeline stages pass: install, lint, typecheck, test, build.
- Artifact versioned and traceable to commit hash.
- Deploy to staging completed with post-deploy smoke pass.
- Production deploy has approval gate and rollback plan.
- Monitoring and alerting rules updated for new feature.
- Secrets and environment variables validated per environment.

## Product/Architecture DoD
- Functional behavior matches business requirement.
- Non-functional targets respected (performance, security, observability).
- Data model and API changes are consistent with roadmap.
- Dependencies and risks are tracked with owners and due dates.

## Release DoD (Go gate)
- All P0 items closed.
- CI/CD green on release branch.
- Smoke tests green in staging and post-production.
- Security checks complete and accepted.
- Formal Go decision documented.
