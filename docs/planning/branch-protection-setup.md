# Branch Protection Setup (GitHub)

## Objective
Require CI and PR checklist guard before merge to main.

## Required Workflows
- CI
- PR Checklist Guard

## Steps
1. Open repository Settings.
2. Go to Branches and create or edit branch protection rule for main.
3. Enable Require a pull request before merging.
4. Enable Require status checks to pass before merging.
5. Select these checks:
   - Backend Build
   - Frontend Build
   - OpenAPI Validate
   - Validate DoD Checklist
6. Enable Require branches to be up to date before merging.
7. Save changes.

## Recommended Extras
- Require approvals: minimum 1.
- Dismiss stale approvals when new commits are pushed.
- Restrict who can push directly to main.
- Enable conversation resolution before merge.

## Expected Result
No pull request can be merged into main unless CI and DoD checklist checks are green.
