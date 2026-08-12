#!/bin/zsh
# One-time setup: Jarvis PTT starts at login (no Terminal after this).
# Hold Ctrl+M in Cursor → speak → release → auto Enter.
# Usage: install-jarvis-ptt.sh [--restart]   # --restart skips Accessibility prompt
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SWIFT="$ROOT/scripts/jarvis-ptt-autosend.swift"
APP="${HOME}/Applications/Jarvis PTT.app"
BIN="$APP/Contents/MacOS/jarvis-ptt-autosend"
LEGACY_PLIST="${HOME}/Library/LaunchAgents/com.aliyan.jarvis-ptt-autosend.plist"
LOG="${HOME}/.cursor/jarvis-ptt-autosend.log"
RESTART_ONLY=0
[[ "${1:-}" == "--restart" ]] && RESTART_ONLY=1

mkdir -p "$APP/Contents/MacOS" "${HOME}/.cursor" "${HOME}/Applications"

echo "Building Jarvis PTT.app…"
xcrun swiftc -O -o "$BIN" "$SWIFT"
chmod +x "$BIN"

cat >"$APP/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleExecutable</key>
  <string>jarvis-ptt-autosend</string>
  <key>CFBundleIdentifier</key>
  <string>com.aliyan.jarvis-ptt-autosend</string>
  <key>CFBundleName</key>
  <string>Jarvis PTT</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleShortVersionString</key>
  <string>1.2</string>
  <key>CFBundleVersion</key>
  <string>3</string>
  <key>LSMinimumSystemVersion</key>
  <string>13.0</string>
  <key>LSUIElement</key>
  <true/>
</dict>
</plist>
PLIST

codesign -s - -f --deep "$APP" >/dev/null 2>&1 || true
ln -sfn "$BIN" "${HOME}/.cursor/jarvis-ptt-autosend"

# Prefer Login Item + KeepAlive LaunchAgent (binary path). Accessibility must
# be granted to “Jarvis PTT” (or the binary) or the event tap fails.
if [[ -f "$LEGACY_PLIST" ]]; then
  launchctl bootout "gui/$(id -u)" "$LEGACY_PLIST" 2>/dev/null || true
fi
pkill -f 'jarvis-ptt-autosend' 2>/dev/null || true
sleep 0.3

cat >"$LEGACY_PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.aliyan.jarvis-ptt-autosend</string>
  <key>ProgramArguments</key>
  <array>
    <string>$BIN</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>$LOG</string>
  <key>StandardErrorPath</key>
  <string>$LOG</string>
  <key>ThrottleInterval</key>
  <integer>5</integer>
</dict>
</plist>
PLIST

if [[ "$RESTART_ONLY" -eq 0 ]]; then
  echo ""
  echo "════════════════════════════════════════════════════════"
  echo " ONE-TIME (then never open Terminal for this again)"
  echo "════════════════════════════════════════════════════════"
  echo "1. System Settings → Privacy & Security → Accessibility"
  echo "2. Enable  Jarvis PTT  (toggle OFF→ON if already listed)"
  echo "3. Come back and press Enter"
  echo ""

  open "x-apple.systempreferences:com.apple.settings.PrivacySecurity.extension?Privacy_Accessibility" 2>/dev/null \
    || open -a "System Settings" 2>/dev/null \
    || true

  if [[ -t 0 ]]; then
    read -r "?Press Enter after Accessibility is ON… "
  fi
fi

: >"$LOG"
launchctl bootout "gui/$(id -u)" "$LEGACY_PLIST" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$LEGACY_PLIST" 2>/dev/null \
  || launchctl load "$LEGACY_PLIST" 2>/dev/null \
  || open "$APP"
sleep 1.2

# Login Item backup so it starts every time you log in
osascript <<APPLESCRIPT >/dev/null
tell application "System Events"
  repeat with li in (get login items)
    try
      if name of li is "Jarvis PTT" then delete li
    end try
  end repeat
  make new login item at end of login items with properties {path:"$APP", hidden:true}
end tell
APPLESCRIPT

if grep -q "OK: Jarvis PTT running" "$LOG" 2>/dev/null; then
  echo "✓ Jarvis PTT is running in the background and set as a Login Item."
  echo "  Daily use: open Cursor → hold Ctrl+M → “Hey Jarvis, what's the update” → release."
  echo "  No Enter needed — helper submits after STT. Agent opens dashboard + reads brief."
  exit 0
fi

echo "✗ Accessibility still blocking the helper."
echo "  Enable Jarvis PTT in Accessibility, then rerun:"
echo "    $ROOT/scripts/install-jarvis-ptt.sh --restart"
exit 1
