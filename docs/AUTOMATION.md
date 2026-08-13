# Automation — morning refresh + wrap

Ways to keep the dashboard current without manual “Hey Jarvis, refresh” every day.

## 1. Project hook (ships with this repo)

File: `.cursor/hooks.json` → `sessionStart` → `.cursor/hooks/morning-brief.sh`

- When a new Agent chat starts between **local 08:00–10:59**, the hook sets `JARVIS_MORNING_WINDOW=1` and (best-effort) injects a morning-brief reminder.
- Outside that window it only sets `JARVIS_MORNING_WINDOW=0`.

**Caveat:** Cursor’s `sessionStart` `additional_context` can race and be dropped. Prefer a scheduled Automation (below) for a reliable 09:00 run. The hook is still useful as a soft nudge + env flag.

Enable Hooks in Cursor Settings → Hooks, then open this project.

## 2. Cursor Automation at 09:00 (recommended)

Create a **scheduled** Cursor Automation that runs once each weekday morning:

**Name:** Jarvis morning dashboard refresh  

**Trigger:** Schedule · weekdays · 09:00 (your timezone)  

**Tools:** Slack, Gmail, Google Calendar, GitHub (read); write `web/public/data/dashboard.json`  

**Instructions (paste):**

```text
You are Jarvis for the Cursor Work Dashboard template.
1. Pull Slack, Gmail, Calendar, GitHub. Filter noise per docs/WORK-ASSISTANT.md.
2. Write web/public/data/dashboard.json with concise Brief / Inbox / Wrap / Actions / Ops fields. Keep stable item ids.
3. Remind user to run: cd web && yarn dev → http://localhost:5173 (Reload in header).
4. Reply with a short morning brief + TODAY'S PRIORITIES (top 3).
5. Never send Slack or email. Draft only if the instructions ask for a draft.
6. Never invent deadlines — mark CONFIRMED / INFERRED / UNKNOWN.
```

Ask Agent: *“Open the Automations editor with a Jarvis 9am morning refresh draft”* to prefill.

## 3. In-session `/loop` (while Cursor stays open)

In Agent chat:

```text
/loop 1d Hey Jarvis, refresh the work dashboard from Slack, Gmail, Calendar, GitHub. Update web/public/data/dashboard.json. Concise brief only. Do not send messages.
```

Or for a same-day check every few hours: `/loop 3h …`. Stop with “stop the loop”.

## End-of-day wrap

Say: **Hey Jarvis, wrap** / **end of day** / **EOD wrap**

Agent should:

1. Pull sources again (or reuse last snapshot if under 15 minutes old).
2. Fill dashboard.json Wrap fields: Closed today · Still waiting · Tomorrow top 3 (+ tomorrow calendar).
3. Lead chat with a short wrap verdict.

## Quick actions (draft only)

In the React **Actions** view (or say “draft a Slack reply to …”):

1. Compose text in the app (or Agent drafts it).
2. Agent creates **Gmail draft** or **Slack draft** via MCP — **never send** unless the user explicitly says send.
3. Mark Actions status DRAFT READY after the MCP draft exists.
