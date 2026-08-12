#!/bin/zsh
# Thin wrapper — prefer login app install (no Terminal after one-time setup).
exec "$(cd "$(dirname "$0")" && pwd)/install-jarvis-ptt.sh"
