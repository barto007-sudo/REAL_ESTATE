# Jira Import Guide for REAL_ESTATE Backlog

## File to Import
- docs/planning/jira-import-real-estate.csv

## Recommended Import Type
- CSV import into a Jira company-managed project.

## Suggested Field Mapping
- Issue Type -> Issue Type
- Summary -> Summary
- Description -> Description
- Priority -> Priority
- Labels -> Labels
- Epic Name -> Epic Name
- Epic Link -> Epic Link
- Story Points -> Story Points

## Import Steps
1. Open Jira settings for your target project.
2. Go to External System Import and choose CSV.
3. Upload docs/planning/jira-import-real-estate.csv.
4. Map fields using the mapping above.
5. Run validation and fix any unmapped fields.
6. Execute import.
7. Verify that Epics and Stories are linked correctly.

## Post-Import Checklist
- Confirm all Epics were created.
- Confirm all Stories are linked to the correct Epic.
- Confirm Story Points were imported.
- Confirm labels are present.
- Add assignees, sprint, and target versions.

## Common Fixes
- If Epic Link fails, import Epics first, then Stories in a second pass.
- If Story Points are ignored, verify estimation settings in Jira board configuration.
- If priorities do not map, align priority scheme names before re-import.
