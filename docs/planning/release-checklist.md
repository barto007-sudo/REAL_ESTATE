# Release Checklist

## Pre-Release
- [ ] Pull request approved and merged to main.
- [ ] Required checks are green in CI.
- [ ] Backend build passes (`npm run build` in backend).
- [ ] Frontend build passes (`npm run build` in frontend).
- [ ] OpenAPI contract is validated.
- [ ] Branch protection checks are enforced on main.

## Security and Config
- [ ] Production secrets are configured in environment.
- [ ] JWT secret is set and not using defaults.
- [ ] CORS allowlist matches production domains.
- [ ] HTTPS/TLS termination is confirmed.

## Data and Persistence
- [ ] Database migrations are applied in target environment.
- [ ] Backup or rollback plan is documented.
- [ ] Seed data (if required) is applied safely.

## Deployment
- [ ] Deployment window is confirmed.
- [ ] Application version/tag is documented.
- [ ] Backend deployment completed.
- [ ] Frontend deployment completed.
- [ ] Health endpoint responds successfully.

## Post-Release Validation
- [ ] Smoke tests pass in production.
- [ ] Authentication flow works (login/logout/me).
- [ ] Critical business flows are verified.
- [ ] Monitoring dashboards show healthy metrics.
- [ ] No Sev1/Sev2 incidents in first validation window.

## Closure
- [ ] Release notes published.
- [ ] Team notified of successful release.
- [ ] Follow-up tasks and known issues tracked.
