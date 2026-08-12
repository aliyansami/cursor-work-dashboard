#!/usr/bin/env swift
import Cocoa
import Carbon.HIToolbox

/// Hold Ctrl+M in Cursor → on release, wait for STT, press Return.
/// Runs as Jarvis PTT.app (login item). Grant Accessibility once.
///
/// Cursor disables Voice Submit Keywords while hold-to-talk is held,
/// so this helper is required for hands-free send.

private let cursorBundle = "com.todesktop.230313mzl4w4u92"
private let sendDelay: TimeInterval = Double(ProcessInfo.processInfo.environment["JARVIS_PTT_SEND_DELAY"] ?? "2.2") ?? 2.2
private let pidFile = NSString(string: "~/.cursor/jarvis-ptt-autosend.pid").expandingTildeInPath
private let logFile = NSString(string: "~/.cursor/jarvis-ptt-autosend.log").expandingTildeInPath

private func log(_ msg: String) {
    let stamp = ISO8601DateFormatter().string(from: Date())
    let line = "[\(stamp)] \(msg)\n"
    if let data = line.data(using: .utf8) {
        if FileManager.default.fileExists(atPath: logFile) {
            if let handle = try? FileHandle(forWritingTo: URL(fileURLWithPath: logFile)) {
                handle.seekToEndOfFile()
                handle.write(data)
                try? handle.close()
            }
        } else {
            try? data.write(to: URL(fileURLWithPath: logFile))
        }
    }
    fputs(line, stderr)
}

private final class State {
    static let shared = State()
    var ctrlMDown = false
    var pending: DispatchWorkItem?
    var eventTap: CFMachPort?

    func frontmostIsCursor() -> Bool {
        NSWorkspace.shared.frontmostApplication?.bundleIdentifier == cursorBundle
    }

    func reenableTapIfNeeded() {
        guard let tap = eventTap else { return }
        CGEvent.tapEnable(tap: tap, enable: true)
    }

    func pressReturn() {
        guard frontmostIsCursor() else {
            log("skip Return — Cursor not frontmost")
            return
        }
        let src = CGEventSource(stateID: .hidSystemState)
        let down = CGEvent(keyboardEventSource: src, virtualKey: CGKeyCode(kVK_Return), keyDown: true)
        let up = CGEvent(keyboardEventSource: src, virtualKey: CGKeyCode(kVK_Return), keyDown: false)
        down?.post(tap: .cghidEventTap)
        up?.post(tap: .cghidEventTap)
        log("sent Return after Ctrl+M release")
    }

    func scheduleSend() {
        pending?.cancel()
        let work = DispatchWorkItem { [weak self] in self?.pressReturn() }
        pending = work
        log("scheduled Return in \(sendDelay)s")
        DispatchQueue.main.asyncAfter(deadline: .now() + sendDelay, execute: work)
    }

    func cancelPending() {
        pending?.cancel()
        pending = nil
    }
}

private func writePid() {
    try? "\(ProcessInfo.processInfo.processIdentifier)".write(toFile: pidFile, atomically: true, encoding: .utf8)
}

private func clearPid() {
    try? FileManager.default.removeItem(atPath: pidFile)
}

writePid()
signal(SIGINT) { _ in
    State.shared.cancelPending()
    clearPid()
    exit(0)
}
signal(SIGTERM) { _ in
    State.shared.cancelPending()
    clearPid()
    exit(0)
}

let mask: CGEventMask = (1 << CGEventType.keyDown.rawValue) | (1 << CGEventType.keyUp.rawValue)
guard let tap = CGEvent.tapCreate(
    tap: .cgSessionEventTap,
    place: .headInsertEventTap,
    options: .defaultTap,
    eventsOfInterest: mask,
    callback: { _, type, event, _ in
        // Critical: macOS disables taps after idle timeout — re-enable or auto-Enter dies silently.
        if type == .tapDisabledByTimeout || type == .tapDisabledByUserInput {
            State.shared.reenableTapIfNeeded()
            return Unmanaged.passUnretained(event)
        }
        let keycode = event.getIntegerValueField(.keyboardEventKeycode)
        let flags = event.flags
        let ctrl = flags.contains(.maskControl)
        if keycode == 46 { // kVK_ANSI_M
            let state = State.shared
            if type == .keyDown && ctrl {
                state.ctrlMDown = true
                state.cancelPending()
            } else if type == .keyUp && state.ctrlMDown {
                state.ctrlMDown = false
                if state.frontmostIsCursor() {
                    state.scheduleSend()
                }
            }
        }
        return Unmanaged.passUnretained(event)
    },
    userInfo: nil
) else {
    log("ERROR: Could not create event tap — Accessibility not granted for Jarvis PTT.")
    clearPid()
    exit(1)
}

State.shared.eventTap = tap
let source = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, tap, 0)
CFRunLoopAddSource(CFRunLoopGetCurrent(), source, .commonModes)
CGEvent.tapEnable(tap: tap, enable: true)

// Keep the tap alive even if macOS disables it quietly (no callback in some cases).
Timer.scheduledTimer(withTimeInterval: 5.0, repeats: true) { _ in
    State.shared.reenableTapIfNeeded()
}

log("OK: Jarvis PTT running (delay \(sendDelay)s). Hold Ctrl+M in Cursor → speak → release.")
CFRunLoopRun()
