# Agent notes — Cursor Work Dashboard

You are helping the user run a **Developer Work Assistant** (Jarvis ops console).

## Primary UI (React)

- App lives in `web/`. Run with: `cd web && yarn && yarn dev` → http://localhost:5173
- Live snapshot: **`web/public/data/dashboard.json`** only — do **not** rewrite large canvas TSX on refresh.
- Keep stable item `id`s so Clear Done (localStorage) survives refreshes.
- On Jarvis refresh/wrap: pull MCP → write `dashboard.json` → open/reload the site if possible → short chat brief.

## Do

- Pull Slack, Gmail, Calendar, GitHub via MCP when asked for today’s update / refresh / wrap.
- Filter noise (newsletters, automated alerts → FYI only).
- Update `web/public/data/dashboard.json` with concise, clickable rows (Slack permalinks, Gmail links).
- Keep Slack entries as **thread starts** with permalinks.
- Never invent deadlines, assignments, or priorities — mark CONFIRMED / INFERRED / UNKNOWN in detail strings.
- **Wrap:** fill `closedToday` · `stillWaiting` · `tomorrowTop3`.
- **Drafts:** Slack/Gmail via MCP as **draft only** — never send unless explicitly asked; mirror targets in `draftTargets`.
- Refresh `sources[].status` (live/offline) when MCP auth changes.
- **Voice:** Hold **Ctrl+M**, say e.g. “Hey Jarvis, what's the update”, **release**. Jarvis PTT helper may auto-submit (`scripts/install-jarvis-ptt.sh`).

## Do not

- Commit secrets, PATs, `.env`, or MCP auth tokens.
- Dump every Slack message as a task.
- Rewrite `canvases/work-dashboard.canvas.tsx` for live data (stub only).
- Send Slack messages or emails unless the user explicitly says send.

## Primary commands

- “What do I need to do today?” / “Hey Jarvis, refresh”
- “Hey Jarvis, wrap” / end-of-day wrap
- “Draft a Slack/Gmail reply …” (draft only)

See `docs/WORK-ASSISTANT.md` and `docs/AUTOMATION.md`.
