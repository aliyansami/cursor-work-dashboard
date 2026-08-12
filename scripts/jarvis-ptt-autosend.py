#!/usr/bin/env python3
"""Jarvis PTT auto-send for Cursor.

Hold Ctrl+M to speak (Cursor hold-to-talk). On release, wait for STT to
finish filling the composer, then press Return so the agent runs.

Requires: System Settings → Privacy & Security → Accessibility → allow
Terminal / Cursor / python (whichever launches this script).

Stop: Ctrl+C, or kill the PID in ~/.cursor/jarvis-ptt-autosend.pid
"""
from __future__ import annotations

import os
import signal
import subprocess
import sys
import threading
import time

PID_FILE = os.path.expanduser("~/.cursor/jarvis-ptt-autosend.pid")
CURSOR_BUNDLE = "com.todesktop.230313mzl4w4u92"
# Delay after Ctrl+M release so Cursor can finish batch STT into the box.
SEND_DELAY_SEC = float(os.environ.get("JARVIS_PTT_SEND_DELAY", "2.0"))
KEYCODE_M = 46
KEYCODE_RETURN = 36


def frontmost_is_cursor() -> bool:
    try:
        out = subprocess.check_output(
            [
                "osascript",
                "-e",
                'tell application "System Events" to get bundle identifier of first process whose frontmost is true',
            ],
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
        return out == CURSOR_BUNDLE
    except (subprocess.CalledProcessError, OSError):
        return False


def press_return() -> None:
    if not frontmost_is_cursor():
        return
    # key code 36 = Return
    subprocess.run(
        [
            "osascript",
            "-e",
            'tell application "System Events" to key code 36',
        ],
        check=False,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def write_pid() -> None:
    os.makedirs(os.path.dirname(PID_FILE), exist_ok=True)
    with open(PID_FILE, "w", encoding="utf-8") as f:
        f.write(str(os.getpid()))


def clear_pid() -> None:
    try:
        os.remove(PID_FILE)
    except OSError:
        pass


def main() -> int:
    try:
        from Quartz import (  # type: ignore
            CFMachPortCreateRunLoopSource,
            CFRunLoopAddSource,
            CFRunLoopGetCurrent,
            CFRunLoopRun,
            CGEventGetFlags,
            CGEventGetIntegerValueField,
            CGEventTapCreate,
            CGEventTapEnable,
            kCFRunLoopCommonModes,
            kCGEventFlagMaskControl,
            kCGEventKeyDown,
            kCGEventKeyUp,
            kCGHeadInsertEventTap,
            kCGKeyboardEventKeycode,
            kCGSessionEventTap,
        )
    except Exception as exc:  # noqa: BLE001
        print(
            "Need pyobjc Quartz (usually present on macOS Python). "
            f"Import failed: {exc}",
            file=sys.stderr,
        )
        return 1

    write_pid()
    pending: threading.Timer | None = None
    lock = threading.Lock()
    ctrl_m_down = False

    def cancel_pending() -> None:
        nonlocal pending
        with lock:
            if pending is not None:
                pending.cancel()
                pending = None

    def schedule_send() -> None:
        nonlocal pending

        def _fire() -> None:
            press_return()

        cancel_pending()
        with lock:
            pending = threading.Timer(SEND_DELAY_SEC, _fire)
            pending.daemon = True
            pending.start()

    def tap_callback(proxy, event_type, event, refcon):  # noqa: ANN001, ARG001
        nonlocal ctrl_m_down
        try:
            keycode = CGEventGetIntegerValueField(event, kCGKeyboardEventKeycode)
            flags = CGEventGetFlags(event)
            ctrl = bool(flags & kCGEventFlagMaskControl)
            if keycode != KEYCODE_M:
                return event
            if event_type == kCGEventKeyDown and ctrl:
                ctrl_m_down = True
                cancel_pending()
            elif event_type == kCGEventKeyUp and ctrl_m_down:
                ctrl_m_down = False
                if frontmost_is_cursor():
                    schedule_send()
        except Exception:  # noqa: BLE001
            pass
        return event

    tap = CGEventTapCreate(
        kCGSessionEventTap,
        kCGHeadInsertEventTap,
        0,
        (1 << kCGEventKeyDown) | (1 << kCGEventKeyUp),
        tap_callback,
        None,
    )
    if not tap:
        print(
            "Could not create event tap. Grant Accessibility to this process "
            "(System Settings → Privacy & Security → Accessibility), then rerun.",
            file=sys.stderr,
        )
        clear_pid()
        return 1

    CGEventTapEnable(tap, True)
    source = CFMachPortCreateRunLoopSource(None, tap, 0)
    CFRunLoopAddSource(CFRunLoopGetCurrent(), source, kCFRunLoopCommonModes)

    def _stop(*_args: object) -> None:
        cancel_pending()
        clear_pid()
        sys.exit(0)

    signal.signal(signal.SIGINT, _stop)
    signal.signal(signal.SIGTERM, _stop)

    print(
        f"Jarvis PTT auto-send running (delay {SEND_DELAY_SEC}s). "
        "Hold Ctrl+M in Cursor, speak, release — Return is sent automatically.",
        flush=True,
    )
    CFRunLoopRun()
    clear_pid()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
