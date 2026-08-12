# Cursor Work Dashboard

A **Developer Work Assistant** template for [Cursor](https://cursor.com): turn Slack, Gmail, Calendar, and GitHub into a concise daily dashboard — priorities, tasks, schedule, Slack thread starts, and email — without dumping every message into a task list.

This repo is meant to be **cloned and customized**. It ships **demo data only**. No API keys, tokens, or personal accounts are included.

![Status](https://img.shields.io/badge/Cursor-Canvas%20%2B%20Agent-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## What you get

| Piece | Purpose |
|-------|---------|
| `canvases/work-dashboard.canvas.tsx` | **Ops-console** Canvas — Brief / Inbox / Wrap / Actions / Ops |
| `docs/WORK-ASSISTANT.md` | Agent operating rules (filter → prioritize → organize) |
| `docs/JARVIS-RULE.md` | Optional “Hey Jarvis…” voice/command phrases |
| `docs/AUTOMATION.md` | Morning refresh hook, 09:00 Automation, `/loop`, EOD wrap |
| `docs/SETUP.md` | Connect Slack / Gmail / Calendar / GitHub MCP |
| `.cursor/hooks.json` | Local morning-window `sessionStart` nudge |
| `AGENTS.md` | Short agent entrypoint for this project |

### UI views

- **Brief** — priorities, tasks, schedule
- **Inbox** — Slack thread starts + email (clickable links)
- **Wrap** — end-of-day: closed · still waiting · tomorrow top 3
- **Actions** — compose Slack/Gmail drafts (Agent creates drafts only — never auto-send)
- **Ops** — project matrix + MCP link health + automation pointer

## Quick start

1. **Clone**
   ```bash
   git clone https://github.com/aliyansami/cursor-work-dashboard.git
   cd cursor-work-dashboard
   ```

2. **Open in Cursor**  
   File → Open Folder → this repo.

3. **Connect MCP integrations** (Settings → Tools & MCP / Marketplace):
   - Slack (OAuth)
   - Gmail (Google OAuth — use your work Google account)
   - Google Calendar
   - GitHub (Personal Access Token — paste **raw** token only, never commit it)

   Details: [docs/SETUP.md](docs/SETUP.md)

4. **Install the Canvas**  
   Cursor only auto-detects canvases under:
   ```text
   ~/.cursor/projects/<your-workspace-id>/canvases/
   ```
   Copy the template:
   ```bash
   mkdir -p ~/.cursor/projects/cursor-work-dashboard/canvases
   cp canvases/work-dashboard.canvas.tsx \
     ~/.cursor/projects/cursor-work-dashboard/canvases/
   ```
   Or ask Agent: *“Copy the work dashboard canvas into my canvases folder and refresh it from my Slack and Gmail.”*

5. **Ask Agent**
   - `What do I need to do today?`
   - `Hey Jarvis, what's the update for today?` (after adding the Jarvis rule)
   - `Refresh inbox`

The agent pulls live data from your MCPs, filters noise, updates the canvas, and keeps links clickable (Slack permalinks → Slack, Gmail → Gmail).

## Security (read this)

- **Never** commit `.env`, MCP configs with tokens, PATs, or OAuth secrets.
- GitHub PAT stays in Cursor MCP settings only.
- This template uses **fake demo rows**. Replace them by asking Agent to refresh — do not paste secrets into the canvas file.
- Before opening a PR, scan diffs for emails, tokens (`ghp_`, `github_pat_`), Slack tokens, and private message content.

## How it works

```text
Slack / Gmail / Calendar / GitHub  →  Cursor Agent (filter + prioritize)
                                      ↓
                               Canvas dashboard (snapshot UI)
                                      ↓
                         Click row → open Slack / Gmail / GitHub
```

The Canvas is a **snapshot**, not a live websocket. Refresh by asking Agent (or optional Cursor Automations on Slack events — see SETUP).

## Voice (“Hey Jarvis”)

Cursor has **push-to-talk** (mic / Ctrl+M), not an always-on wake word. Add [docs/JARVIS-RULE.md](docs/JARVIS-RULE.md) as a personal Cursor rule so phrases like “Hey Jarvis, what’s the update for today?” trigger the daily briefing.

## Contributing

PRs welcome — UI polish, better filtering heuristics, docs, and new sections (Linear, Notion, etc.).

1. Fork → branch → PR  
2. Keep demo data fictional  
3. No secrets in commits  

## License

MIT — see [LICENSE](LICENSE).
