import { actionCount, scopeMeta } from "../data/loadDashboard";
import { useDashboard } from "../context";
import { Code, Pill, Row, Spacer, Swatch, Text } from "./ui";

export function ChannelSwitcher() {
  const { data, scope, setScope, cleared } = useDashboard();
  const meta = scopeMeta(data.scopes, scope);
  const count = actionCount(data, scope, cleared.clearedIds);

  return (
    <div className="channel-switcher">
      <div className="row row-between row-wrap" style={{ gap: 8 }}>
        <Text size="small" tone="tertiary" weight="medium">
          SLACK / PROJECT
        </Text>
        <Text size="small" tone="quaternary">
          Select a project → filter tasks, inbox, wrap, drafts
        </Text>
      </div>
      <Spacer size={8} />
      <select
        className="select"
        value={scope}
        onChange={(e) => setScope(e.target.value)}
      >
        {data.scopes.map((s) => {
          const actions = actionCount(data, s.id, cleared.clearedIds);
          const base = s.slack ? `${s.short} · ${s.slack}` : s.short;
          return (
            <option key={s.id} value={s.id}>
              {actions > 0 ? `${base} · ${actions}` : base}
            </option>
          );
        })}
      </select>
      {scope !== "all" && (
        <>
          <Spacer size={8} />
          <Row wrap gap={8}>
            <Swatch color={meta.color} />
            <Text weight="semibold" size="small">
              {meta.project}
            </Text>
            {meta.slack ? (
              <Code>{meta.slack}</Code>
            ) : (
              <Text tone="tertiary" size="small">
                No dedicated Slack channel · email / calendar / GitHub
              </Text>
            )}
            {count > 0 ? <Pill active>{count} ACTIONS</Pill> : <Pill>NO ACTIONS</Pill>}
          </Row>
        </>
      )}
    </div>
  );
}
