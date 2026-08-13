# Setup — MCP integrations

Connect these in **Cursor Settings → Tools & MCP** (or Marketplace plugins). Tokens stay in Cursor — never in this repo.

## 1. GitHub

1. Create a [Personal Access Token](https://github.com/settings/personal-access-tokens) (fine-grained recommended).
2. Scopes: at least read access to repos, issues, and pull requests you care about.
3. In the GitHub MCP config field, paste **only** the raw token (`ghp_…` or `github_pat_…`).
4. Do **not** type `Bearer`, quotes, or paste an SSH private key.
5. Save → restart Cursor if needed → ask Agent: “Who am I on GitHub?”

## 2. Slack

1. Install the Slack plugin / MCP.
2. Click **Authenticate** → OAuth into the workspace you want.
3. Cursor account email does **not** need to match Slack email.
4. Workspace admins may need to approve the Cursor / Slack MCP app.

## 3. Gmail + Google Calendar

1. Install Gmail and Google Calendar plugins.
2. Authenticate with the **Google account that holds your work mail/calendar**.
3. If Chrome defaults to a personal account, choose “Use another account”.
4. These plugins only work with Google / Google Workspace mailboxes.

## 4. First dashboard refresh

In Agent chat:

```text
Refresh the work dashboard from Slack, Gmail, Calendar, and GitHub.
Use the template in canvases/work-dashboard.canvas.tsx.
Replace demo data. Keep the UI concise. Thread starts only for Slack.
```

Copy the canvas into Cursor’s canvases folder if it does not appear beside chat (see README).

## Auto-refresh reality check

| Goal | Supported? |
|------|------------|
| Manual refresh via Agent / “Hey Jarvis” | Yes |
| Canvas live websocket on every email | No |
| Cursor Automation on Slack channel messages | Optional (Automations UI) |

## Troubleshooting

- **GitHub “Authorization header badly formatted”** — token field must be raw PAT only.
- **GitHub timeouts** — Reload MCP → restart Cursor → re-save PAT.
- **Slack needsAuth** — complete OAuth; check admin app approval.
- **Wrong Gmail** — Clear MCP tokens / reconnect with the correct Google account.
