import { useDashboard } from "../context";
import type { ViewId } from "../types";
import { Code, H1, Panel, Pill, Row, Stack, Text } from "./ui";

const TABS: { id: ViewId; label: string }[] = [
  { id: "brief", label: "Brief" },
  { id: "inbox", label: "Inbox" },
  { id: "wrap", label: "Wrap" },
  { id: "actions", label: "Actions" },
  { id: "ops", label: "Ops" },
];

export function MissionHeader() {
  const { data, view, setView, reload } = useDashboard();
  return (
    <Panel>
      <Row between wrap gap={12}>
        <Stack gap={4}>
          <Row wrap gap={8}>
            <span className="eyebrow">JARVIS // OPS</span>
            <Pill active>LIVE</Pill>
          </Row>
          <H1>Command center</H1>
          <Text tone="secondary" size="small">
            {data.user} · <Code>{data.workspace}</Code> · {data.generatedAt}
          </Text>
        </Stack>
        <Row wrap gap={6}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={view === t.id ? "btn btn-primary" : "btn"}
              onClick={() => setView(t.id)}
            >
              {t.label}
            </button>
          ))}
          <button type="button" className="btn btn-ghost" onClick={reload} title="Reload JSON">
            Reload
          </button>
        </Row>
      </Row>
    </Panel>
  );
}
