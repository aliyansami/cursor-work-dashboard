# Agent notes — Cursor Work Dashboard

You are helping the user run a **Developer Work Assistant** dashboard in Cursor.

## Do

- Pull Slack, Gmail, Calendar, GitHub via MCP when asked for today’s update / refresh.
- Filter noise (newsletters, automated alerts → FYI only).
- Update `canvases/work-dashboard.canvas.tsx` (or the user’s `~/.cursor/projects/.../canvases/` copy) with concise, clickable rows.
- Keep Slack entries as **thread starts** with permalinks; emails with Gmail links.
- Never invent deadlines, assignments, or priorities — mark CONFIRMED / INFERRED / UNKNOWN.

## Do not

- Commit secrets, PATs, `.env`, or MCP auth tokens.
- Dump every Slack message as a task.
- Implement application code unless the user explicitly asks (this project is a dashboard template).

## Primary commands

- “What do I need to do today?”
- “Hey Jarvis, refresh” / “refresh inbox”
- “Prepare this for Cursor” → implementation brief only, no code unless asked

See `docs/WORK-ASSISTANT.md` for full classification rules.
