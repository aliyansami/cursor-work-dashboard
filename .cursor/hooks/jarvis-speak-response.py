#!/usr/bin/env python3
"""Speak ONLY when armed by Jarvis update/wrap in the work-dashboard workspace."""
from __future__ import annotations

import json
import os
import re
import shutil
import signal
import subprocess
import sys

PID_FILE = os.path.expanduser("~/.cursor/jarvis-speak.pid")
FLAG = os.path.expanduser("~/.cursor/jarvis-speak-armed")
CANVAS_DATA = os.path.expanduser(
    "~/.cursor/projects/Users-aaliyan-cursor-work-dashboard/canvases/work-dashboard.canvas.data.json"
)
SAY_VOICE = os.environ.get("JARVIS_SAY_VOICE", "Samantha")


def stop_previous() -> None:
    if not os.path.exists(PID_FILE):
        return
    try:
        with open(PID_FILE, encoding="utf-8") as f:
            pid = int(f.read().strip())
        os.kill(pid, signal.SIGTERM)
    except (OSError, ValueError):
        pass
    try:
        os.remove(PID_FILE)
    except OSError:
        pass


def voice_enabled() -> bool:
    if not os.path.exists(CANVAS_DATA):
        return True
    try:
        with open(CANVAS_DATA, encoding="utf-8") as f:
            data = json.load(f)
        return data.get("jarvis-voice-responses", True) is not False
    except (json.JSONDecodeError, OSError):
        return True


def consume_arm() -> bool:
    if not os.path.exists(FLAG):
        return False
    try:
        os.remove(FLAG)
        return True
    except OSError:
        return False


def to_speakable(text: str) -> str:
    text = re.sub(r"```[\s\S]*?```", " ", text)
    text = re.sub(r"`[^`]+`", " ", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"https?://\s*\S+", " ", text)
    text = re.sub(r"[#*_>|]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return ""
    # Prefer the verdict + top priorities for voice (skip long dashboard dump).
    parts = re.split(r"(?<=[.!?])\s+", text)
    brief = " ".join(parts[:6])
    if len(brief) > 700:
        return brief[:697] + "..."
    return brief


def main() -> None:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        print("{}")
        return

    raw = payload.get("text", "")
    # Armed only by jarvis-arm-speak for Jarvis update/wrap in this workspace.
    if not consume_arm() or not raw or not voice_enabled():
        print("{}")
        return

    speakable = to_speakable(raw)
    if not speakable or not shutil.which("say"):
        print("{}")
        return

    stop_previous()
    proc = subprocess.Popen(["say", "-v", SAY_VOICE, speakable])  # noqa: S603,S607
    try:
        with open(PID_FILE, "w", encoding="utf-8") as f:
            f.write(str(proc.pid))
    except OSError:
        pass
    print("{}")


if __name__ == "__main__":
    main()
