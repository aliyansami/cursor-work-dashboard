# Contributing

Thanks for improving the Cursor Work Dashboard.

## Guidelines

1. Keep **demo data fictional** in `canvases/work-dashboard.canvas.tsx`.
2. Never commit secrets, PATs, OAuth clients, or real private messages.
3. Prefer small PRs: one UI improvement, one docs fix, or one feature.
4. Match the existing Canvas SDK style (`cursor/canvas` only — no npm imports in `.canvas.tsx`).

## Dev loop

1. Edit the canvas / docs locally.
2. Ask Agent: “Refresh dashboard” to validate against your own MCPs (keep personal data out of commits).
3. Open a PR to `main` with a short summary + test notes (e.g. “Canvas typecheck clean”, “README link check”).

## Feature ideas

- Linear / Notion / Jira sections
- Better “waiting for” tracking
- Sample Cursor Automation YAML docs for Slack-triggered refresh
- Light/dark polish using `useHostTheme()` tokens only
