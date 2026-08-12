#!/usr/bin/env bash
# Morning brief nudge for Cursor Work Dashboard (sessionStart).
# Sets env when local hour is 08–10. additional_context is best-effort
# (sessionStart injection can race — see docs/AUTOMATION.md).
set -euo pipefail

hour="$(date +%H)"
hour=$((10#$hour))

if (( hour >= 8 && hour <= 10 )); then
  python3 - <<'PY'
import json
print(json.dumps({
  "env": {
    "JARVIS_MORNING_WINDOW": "1",
    "JARVIS_BRIEF_MODE": "morning"
  },
  "additional_context": (
    "JARVIS morning window (local 08–10). If the user has not already briefed today, "
    "pull Slack, Gmail, Calendar, and GitHub; filter noise; refresh the work-dashboard "
    "canvas (repo canvases/ or ~/.cursor/projects/.../canvases/); lead with a concise "
    "Jarvis morning brief and TODAY'S PRIORITIES (top 3). "
    "Never send Slack or Gmail — drafts only if asked. Do not invent deadlines."
  )
}))
PY
else
  printf '%s\n' '{"env":{"JARVIS_MORNING_WINDOW":"0"}}'
fi
