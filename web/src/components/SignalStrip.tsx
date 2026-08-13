import { inScope, scopeMeta } from "../data/loadDashboard";
import { useDashboard } from "../context";
import { Spacer, Stack, Text } from "./ui";

export function SignalStrip() {
  const { data, scope, cleared } = useDashboard();
  const live = data.sources.filter((s) => s.status === "live").length;
  const tasks = cleared.visible(inScope(data.tasks, scope)).length;
  const waiting = cleared.visible(inScope(data.stillWaiting, scope)).length;
  const clearedInScope = [
    ...inScope(data.tasks, scope),
    ...inScope(data.slackThreads, scope),
    ...inScope(data.emails, scope),
    ...inScope(data.stillWaiting, scope),
    ...inScope(data.priorities, scope),
    ...inScope(data.draftTargets, scope),
  ].filter((i) => cleared.clearedIds.includes(i.id)).length;
  const closed = inScope(data.closedToday, scope).length + clearedInScope;
  const drafts = cleared.visible(inScope(data.draftTargets, scope)).length;
  const total = Math.max(tasks + waiting + drafts + 1, 1);

  return (
    <Stack gap={10}>
      <div className="grid-stats">
        <div className={`stat${tasks ? " stat-warning" : ""}`}>
          <div className="stat-value">{tasks}</div>
          <div className="stat-label">Actions</div>
        </div>
        <div className={`stat${waiting ? " stat-warning" : ""}`}>
          <div className="stat-value">{waiting}</div>
          <div className="stat-label">Waiting</div>
        </div>
        <div className={`stat${closed ? " stat-success" : ""}`}>
          <div className="stat-value">{closed}</div>
          <div className="stat-label">Closed</div>
        </div>
        <div
          className={`stat${scope === "all" ? " stat-success" : drafts ? " stat-warning" : ""}`}
        >
          <div className="stat-value">
            {scope === "all" ? `${live}/4` : String(drafts)}
          </div>
          <div className="stat-label">{scope === "all" ? "Links up" : "Drafts"}</div>
        </div>
      </div>
      <div style={{ background: "var(--fill-tertiary)", borderRadius: 6, padding: "10px 12px" }}>
        <Text size="small" tone="tertiary" weight="medium">
          ATTENTION LOAD
          {scope !== "all"
            ? ` · ${scopeMeta(data.scopes, scope).short.toUpperCase()}`
            : ""}
        </Text>
        <Spacer size={6} />
        <div className="usage-track">
          <div
            className="usage-seg"
            style={{ width: `${(tasks / total) * 100}%`, background: "var(--warning)" }}
          />
          <div
            className="usage-seg"
            style={{ width: `${(waiting / total) * 100}%`, background: "var(--accent)" }}
          />
          <div
            className="usage-seg"
            style={{ width: `${(drafts / total) * 100}%`, background: "var(--danger)" }}
          />
          <div
            className="usage-seg"
            style={{ width: `${(1 / total) * 100}%`, background: "var(--success)" }}
          />
        </div>
      </div>
    </Stack>
  );
}

export function SourceRail() {
  const { data } = useDashboard();
  return (
    <div className="row row-wrap" style={{ gap: 8 }}>
      {data.sources.map((s) => (
        <div key={s.name} className="source-chip">
          <div className="row" style={{ gap: 6 }}>
            <span className={`status-dot status-${s.status}`} />
            <Text weight="semibold" size="small">
              {s.name}
            </Text>
          </div>
          <Text tone="tertiary" size="small">
            {s.account}
          </Text>
        </div>
      ))}
    </div>
  );
}
