# Cursor Work Dashboard

A **Developer Work Assistant** for [Cursor](https://cursor.com): turn Slack, Gmail, Calendar, and GitHub into a concise daily **ops console** — priorities, tasks, schedule, Slack thread starts, and email — without dumping every message into a task list.

This repo is meant to be **cloned and customized**. It ships **demo data only**. No API keys, tokens, or personal accounts are included.

![Status](https://img.shields.io/badge/Vite%20%2B%20React%20%2B%20yarn-ops%20console-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## What you get

| Piece | Purpose |
|-------|---------|
| `web/` | **Primary UI** — Vite + React ops console (Brief / Inbox / Wrap / Actions / Ops) |
| `web/public/data/dashboard.json` | Live snapshot Agent rewrites on refresh (small, fast) |
| `docs/WORK-ASSISTANT.md` | Agent operating rules (filter → prioritize → organize) |
| `docs/JARVIS-RULE.md` | Optional “Hey Jarvis…” voice/command phrases |
| `docs/AUTOMATION.md` | Morning refresh hook, 09:00 Automation, `/loop`, EOD wrap |
| `docs/SETUP.md` | Connect Slack / Gmail / Calendar / GitHub MCP |
| `AGENTS.md` | Short agent entrypoint for this project |
| `canvases/work-dashboard.canvas.tsx` | Thin pointer to the React app (not the live board) |

### UI views

- **Brief** — priorities, tasks, schedule
- **Inbox** — Slack thread starts + email (clickable links)
- **Wrap** — end-of-day: closed · still waiting · tomorrow top 3
- **Actions** — compose Slack/Gmail drafts (Agent creates drafts only — never auto-send)
- **Ops** — MCP setup checklist + project matrix + link health
- **Clear Done** — checkmark clears handled items (localStorage; survives JSON refreshes with stable ids)

## Quick start

1. **Clone**
   ```bash
   git clone https://github.com/aliyansami/cursor-work-dashboard.git
   cd cursor-work-dashboard
   ```

2. **Run the ops console**
   ```bash
   cd web
   yarn
   yarn dev
   ```
   Open [http://localhost:5173](http://localhost:5173).

3. **Open this repo in Cursor** and connect MCP integrations (Settings → Tools & MCP):
   - Slack (OAuth)
   - Gmail (work Google account)
   - Google Calendar
   - GitHub (raw PAT — never commit it)

   Details: [docs/SETUP.md](docs/SETUP.md)

4. **Ask Agent**
   - `What do I need to do today?`
   - `Hey Jarvis, refresh`
   - `Hey Jarvis, wrap`

The agent pulls live data from your MCPs, filters noise, writes **`web/public/data/dashboard.json`**, and gives a short chat brief. Click **Reload** in the app header (or refresh the browser) to pick up the new snapshot.

## Security (read this)

- **Never** commit `.env`, MCP configs with tokens, PATs, or OAuth secrets.
- GitHub PAT stays in Cursor MCP settings only.
- Demo JSON is fictional. Agent refresh replaces it — do not paste secrets into `dashboard.json`.
- Before opening a PR, scan diffs for emails, tokens (`ghp_`, `github_pat_`), Slack tokens, and private message content.

## How it works

```text
Slack / Gmail / Calendar / GitHub  →  Cursor Agent (filter + prioritize)
                                      ↓
                         web/public/data/dashboard.json
                                      ↓
                         yarn Vite React app (localhost:5173)
                                      ↓
                         Click row → open Slack / Gmail / GitHub
```

The UI is a **snapshot**, not a live websocket. Refresh by asking Agent (or optional Automations — see [docs/AUTOMATION.md](docs/AUTOMATION.md)).

## Voice (“Hey Jarvis”)

Cursor has **push-to-talk** (mic / Ctrl+M), not an always-on wake word. Add [docs/JARVIS-RULE.md](docs/JARVIS-RULE.md) as a personal Cursor rule. Prefer Jarvis PTT auto-submit (`scripts/install-jarvis-ptt.sh`) so you do not need Enter after STT.

## Contributing

PRs welcome — UI polish, better filtering heuristics, docs, and new sections (Linear, Notion, etc.).

1. Fork → branch → PR  
2. Keep demo data fictional  
3. No secrets in commits  

## License

MIT — see [LICENSE](LICENSE).
