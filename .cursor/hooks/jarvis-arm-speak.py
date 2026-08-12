#!/usr/bin/env python3
"""beforeSubmitPrompt: arm Jarvis speak only for update/wrap in this workspace."""
from __future__ import annotations

import json
import os
import re
import sys

FLAG = os.path.expanduser("~/.cursor/jarvis-speak-armed")

# Must sound like Jarvis wake + brief/wrap (STT-tolerant). Other chats stay silent.
JARVIS_SPEAK_PROMPT = re.compile(
    r"""(?ix)
    \b(
      hey\s+|hi\s+|ok\s+|okay\s+
    )?
    (
      jarvis|jervis|jairus|jarves|gervis|jartvis
    )\b
    .{0,100}
    \b(
      update|updates|udpate|brief|briefing|refresh|
      wrap|eod|status|plate|missed|today|any\s+update
    )\b
    """,
)

WORKSPACE_HINTS = (
    "cursor-work-dashboard",
    "Users-aaliyan-cursor-work-dashboard",
)


def in_jarvis_workspace(payload: dict) -> bool:
    """Only arm speak inside the work-dashboard project (not other Cursor windows)."""
    blobs: list[str] = []
    for key in (
        "workspace_roots",
        "workspaceRoots",
        "roots",
        "cwd",
        "project_dir",
        "projectDir",
        "workspace_path",
        "workspacePath",
    ):
        val = payload.get(key)
        if isinstance(val, str):
            blobs.append(val)
        elif isinstance(val, list):
            blobs.extend(str(x) for x in val)
    # Also scan nested common shapes
    for key in ("composer", "conversation", "session"):
        nested = payload.get(key)
        if isinstance(nested, dict):
            for v in nested.values():
                if isinstance(v, str):
                    blobs.append(v)
    joined = " ".join(blobs).lower()
    if any(h.lower() in joined for h in WORKSPACE_HINTS):
        return True
    # If hook payload has no path (some Cursor builds), fall back to CWD of the hook process.
    cwd = os.getcwd().lower()
    return any(h.lower() in cwd for h in WORKSPACE_HINTS)


def main() -> None:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        print("{}")
        return

    prompt = str(payload.get("prompt") or "")
    try:
        if in_jarvis_workspace(payload) and JARVIS_SPEAK_PROMPT.search(prompt):
            os.makedirs(os.path.dirname(FLAG), exist_ok=True)
            with open(FLAG, "w", encoding="utf-8") as f:
                f.write(payload.get("generation_id") or "1")
        elif os.path.exists(FLAG):
            # Non-Jarvis / other workspace → never leave a stale arm.
            os.remove(FLAG)
    except OSError:
        pass

    print("{}")


if __name__ == "__main__":
    main()
