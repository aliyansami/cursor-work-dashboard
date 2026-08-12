#!/usr/bin/env bash
# Stop any in-progress Jarvis macOS `say` playback.
set -euo pipefail
PID_FILE="${HOME}/.cursor/jarvis-speak.pid"
if [[ -f "$PID_FILE" ]]; then
  pid="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "${pid:-}" ]]; then
    kill "$pid" 2>/dev/null || true
  fi
  rm -f "$PID_FILE"
fi
pkill -f "^say " 2>/dev/null || true
