# Agent notes — Cursor Work Dashboard

You are helping the user run a **Developer Work Assistant** dashboard in Cursor.

## Do

- Pull Slack, Gmail, Calendar, GitHub via MCP when asked for today’s update / refresh / wrap.
- Filter noise (newsletters, automated alerts → FYI only).
- Update `canvases/work-dashboard.canvas.tsx` (or the user’s `~/.cursor/projects/.../canvases/` copy) with concise, clickable rows.
- Keep Slack entries as **thread starts** with permalinks; emails with Gmail links.
- Never invent deadlines, assignments, or priorities — mark CONFIRMED / INFERRED / UNKNOWN.
- **Wrap:** Closed today · Still waiting · Tomorrow top 3 → **Wrap** tab.
- **Drafts:** Slack/Gmail via MCP as **draft only** — never send unless explicitly asked → **Actions** tab.
- Refresh **SOURCES** status (live/offline) on the Ops setup checklist when MCP auth changes.
- **Voice:** Hold **Ctrl+M**, say e.g. “Hey Jarvis, what's the update”, **release** (no Enter). **Jarvis PTT** auto-submits after STT — must be running (`scripts/install-jarvis-ptt.sh` + Accessibility → enable **Jarvis PTT**). Agent then opens the dashboard and **speaks aloud only** for Jarvis update/wrap in this workspace; other chats stay silent.

## Do not

- Commit secrets, PATs, `.env`, or MCP auth tokens.
- Dump every Slack message as a task.
- Implement application code unless the user explicitly asks (this project is a dashboard template).
- Send Slack messages or emails unless the user explicitly says send.

## Primary commands

- “What do I need to do today?” / “Hey Jarvis, refresh”
- “Hey Jarvis, wrap” / end-of-day wrap
- “Draft a Slack/Gmail reply …” (draft only)
- “Prepare this for Cursor” → implementation brief only, no code unless asked

See `docs/WORK-ASSISTANT.md` and `docs/AUTOMATION.md`.
