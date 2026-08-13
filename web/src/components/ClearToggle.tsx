import { useDashboard } from "../context";

export function ClearToggle({ id }: { id: string }) {
  const { cleared } = useDashboard();
  const done = cleared.isCleared(id);
  return (
    <button
      type="button"
      className={`icon-btn${done ? " done" : ""}`}
      title={done ? "Restore to board" : "Mark done · clear from board"}
      onClick={() => (done ? cleared.restore(id) : cleared.clear(id))}
    >
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
        <circle
          cx="7"
          cy="7"
          r="5.25"
          stroke="currentColor"
          strokeWidth={1.25}
          fill={done ? "currentColor" : "none"}
          opacity={done ? 0.22 : 1}
        />
        <path
          d="M4.2 7.1l1.85 1.85L9.9 5.1"
          stroke="currentColor"
          strokeWidth={1.35}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </button>
  );
}

export function ClearedBar() {
  const { cleared } = useDashboard();
  if (cleared.clearedIds.length === 0) return null;
  return (
    <div className="row row-between row-wrap" style={{ gap: 8 }}>
      <div className="text-sm text-tertiary">
        {cleared.clearedIds.length} cleared · off the board until restore
      </div>
      <div className="row row-wrap" style={{ gap: 6 }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => cleared.setShowCleared(!cleared.showCleared)}
        >
          {cleared.showCleared ? "Hide cleared" : "Show cleared"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => cleared.restoreAll()}>
          Restore all
        </button>
      </div>
    </div>
  );
}
