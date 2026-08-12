/**
 * Cursor Work Dashboard — PUBLIC TEMPLATE
 *
 * Demo data only. No real accounts, tokens, or private messages.
 * Ask your Agent: "Refresh the work dashboard from my Slack/Gmail/GitHub"
 * to replace demo rows with your live data — never commit secrets.
 */
import type { ReactNode } from "react";
import {
  Button,
  Callout,
  Code,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Link,
  Pill,
  Row,
  Spacer,
  Stack,
  Stat,
  Swatch,
  Table,
  Text,
  UsageBar,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";

const GENERATED_AT = "Demo snapshot · replace via Agent refresh";
const USER = "Your Name";
const EMAIL = "you@example.com";
const WORKSPACE = "Your Workspace";

type SourceStatus = "live" | "degraded" | "offline";
type ViewId = "brief" | "inbox" | "ops";

interface SourceRow {
  name: string;
  account: string;
  status: SourceStatus;
  note: string;
}

interface WorkItem {
  id: string;
  title: string;
  project: string;
  priority: "high" | "medium" | "low";
  source: string;
  status: string;
  detail: string;
  href?: string;
}

type FeedItem = {
  id: string;
  title: string;
  preview: string;
  meta: string;
  href: string;
  tag?: string;
  unread?: boolean;
};

const SOURCES: SourceRow[] = [
  { name: "Slack", account: "your-workspace", status: "offline", note: "Connect MCP" },
  { name: "Gmail", account: EMAIL, status: "offline", note: "Connect MCP" },
  { name: "Calendar", account: EMAIL, status: "offline", note: "Connect MCP" },
  { name: "GitHub", account: "your-github", status: "offline", note: "Add PAT in settings" },
];

const TASKS: WorkItem[] = [
  {
    id: "demo-task-1",
    title: "Follow up PR #42 — Fix landing logo",
    project: "Demo Frontend",
    priority: "medium",
    source: "GitHub",
    status: "Open PR",
    detail: "DEMO · replace on refresh",
    href: "https://github.com",
  },
  {
    id: "demo-task-2",
    title: "Investigate refresh-token 401s",
    project: "Demo Backend",
    priority: "high",
    source: "Slack",
    status: "Action",
    detail: "DEMO · sample high-priority task",
    href: "https://slack.com",
  },
];

const CALENDAR_TODAY = [{ time: "10:00–10:30", title: "Team standup", status: "done" }];
const CALENDAR_TOMORROW = [
  { time: "14:00–14:30", title: "Client sync", status: "upcoming" },
];

const PRIORITIES = [
  { n: "01", text: "Connect Slack, Gmail, Calendar, GitHub MCP", href: undefined },
  { n: "02", text: "Ask Agent to refresh this dashboard", href: undefined },
  { n: "03", text: "Optional: add Jarvis rule from docs/JARVIS-RULE.md", href: undefined },
];

const SLACK_THREADS: FeedItem[] = [
  {
    id: "demo-s1",
    title: "#demo-backend",
    preview: "Alex: Can someone check the refresh-token 401s?",
    meta: "DEMO · thread start",
    href: "https://slack.com",
    tag: "Demo",
  },
  {
    id: "demo-s2",
    title: "#demo-frontend",
    preview: "Sam: Logo cropped on mobile — thread started",
    meta: "DEMO · thread start",
    href: "https://slack.com",
    tag: "Demo",
  },
];

const EMAILS: FeedItem[] = [
  {
    id: "demo-e1",
    title: "Invite: collaborate on demo/repo",
    preview: "Example actionable email",
    meta: "DEMO",
    href: "https://mail.google.com",
    tag: "Action",
  },
  {
    id: "demo-e2",
    title: "Automated security alert",
    preview: "Example FYI — no reply required",
    meta: "DEMO · unread",
    href: "https://mail.google.com",
    tag: "Sec",
    unread: true,
  },
];

const PROJECTS = [
  { name: "Backend", color: "blue" as const, load: 45, note: "Sample project card" },
  { name: "Frontend", color: "orange" as const, load: 30, note: "Sample open PR" },
  { name: "Client A", color: "green" as const, load: 15, note: "Sync tomorrow" },
  { name: "Internal", color: "purple" as const, load: 10, note: "Low activity" },
];

function Shell({ children }: { children: ReactNode }) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        minHeight: "100%",
        background: theme.bg.chrome,
        color: theme.text.primary,
        fontFamily: "var(--vscode-editor-font-family, ui-monospace, SFMono-Regular, Menlo, monospace)",
        padding: "16px 18px 28px",
      }}
    >
      {children}
    </div>
  );
}

function StatusDot({ status }: { status: SourceStatus }) {
  const theme = useHostTheme();
  const color =
    status === "live"
      ? theme.diff.stripAdded
      : status === "degraded"
        ? theme.accent.primary
        : theme.text.quaternary;
  return (
    <span
      style={{
        width: 7,
        height: 7,
        borderRadius: 99,
        background: color,
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

function MissionHeader({ view, setView }: { view: ViewId; setView: (v: ViewId) => void }) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        background: theme.bg.elevated,
        border: `1px solid ${theme.stroke.secondary}`,
        borderRadius: 8,
        padding: "14px 16px",
        marginBottom: 14,
      }}
    >
      <Row align="center" justify="space-between" wrap gap={12}>
        <Stack gap={4}>
          <Row gap={8} align="center">
            <Text
              size="small"
              weight="semibold"
              style={{ letterSpacing: "0.14em", color: theme.accent.primary }}
            >
              JARVIS // OPS
            </Text>
            <Pill size="sm">DEMO</Pill>
          </Row>
          <H1 style={{ margin: 0 }}>Command center</H1>
          <Text tone="secondary" size="small">
            {USER} · <Code>{WORKSPACE}</Code> · {GENERATED_AT}
          </Text>
        </Stack>
        <Row gap={6} wrap>
          <Button variant={view === "brief" ? "primary" : "secondary"} onClick={() => setView("brief")}>
            Brief
          </Button>
          <Button variant={view === "inbox" ? "primary" : "secondary"} onClick={() => setView("inbox")}>
            Inbox
          </Button>
          <Button variant={view === "ops" ? "primary" : "secondary"} onClick={() => setView("ops")}>
            Ops
          </Button>
        </Row>
      </Row>
    </div>
  );
}

function SignalStrip() {
  const theme = useHostTheme();
  const live = SOURCES.filter((s) => s.status === "live").length;
  return (
    <Stack gap={10}>
      <Grid columns={4} gap={10}>
        <Stat value={TASKS.length} label="Actions" tone="warning" />
        <Stat value={SLACK_THREADS.length} label="Slack" />
        <Stat value={EMAILS.filter((e) => e.unread).length} label="Unread mail" tone="warning" />
        <Stat value={`${live}/4`} label="Links up" />
      </Grid>
      <div style={{ background: theme.fill.tertiary, borderRadius: 6, padding: "10px 12px" }}>
        <Text size="small" tone="tertiary" weight="medium">
          ATTENTION LOAD
        </Text>
        <Spacer size={6} />
        <UsageBar
          total={10}
          topLeftLabel="Attention mix"
          topRightLabel="demo"
          segments={[
            { id: "tasks", value: 2, color: "orange" },
            { id: "slack", value: 2, color: "blue" },
            { id: "unread", value: 1, color: "red" },
            { id: "clear", value: 5, color: "green" },
          ]}
        />
      </div>
    </Stack>
  );
}

function SourceRail() {
  const theme = useHostTheme();
  return (
    <Row gap={8} wrap>
      {SOURCES.map((s) => (
        <div
          style={{
            border: `1px solid ${theme.stroke.tertiary}`,
            background: theme.fill.quaternary,
            borderRadius: 6,
            padding: "8px 10px",
            minWidth: 120,
          }}
        >
          <Row gap={6} align="center">
            <StatusDot status={s.status} />
            <Text weight="semibold" size="small">
              {s.name}
            </Text>
          </Row>
          <Text tone="tertiary" size="small">
            {s.account}
          </Text>
        </div>
      ))}
    </Row>
  );
}

function PriorityStack() {
  const theme = useHostTheme();
  return (
    <Stack gap={0}>
      {PRIORITIES.map((p) => (
        <div style={{ borderBottom: `1px solid ${theme.stroke.tertiary}`, padding: "12px 0" }}>
          <Row gap={12} align="start">
            <Text
              weight="bold"
              style={{
                color: theme.accent.primary,
                fontVariantNumeric: "tabular-nums",
                minWidth: 28,
              }}
            >
              {p.n}
            </Text>
            {p.href ? <Link href={p.href}>{p.text}</Link> : <Text weight="medium">{p.text}</Text>}
          </Row>
        </div>
      ))}
    </Stack>
  );
}

function TaskCards() {
  const theme = useHostTheme();
  return (
    <Stack gap={8}>
      {TASKS.map((t) => (
        <div
          style={{
            border: `1px solid ${theme.stroke.secondary}`,
            borderLeft: `3px solid ${theme.accent.primary}`,
            borderRadius: 6,
            padding: "10px 12px",
            background: theme.bg.elevated,
          }}
        >
          <Row align="center" justify="space-between" gap={8} wrap>
            <Pill size="sm">{t.priority.toUpperCase()}</Pill>
            <Text tone="tertiary" size="small">
              {t.project}
            </Text>
          </Row>
          <Spacer size={6} />
          {t.href ? <Link href={t.href}>{t.title}</Link> : <Text weight="semibold">{t.title}</Text>}
          <Text tone="secondary" size="small">
            {t.detail} · {t.source}
          </Text>
        </div>
      ))}
    </Stack>
  );
}

function FeedRow({ item }: { item: FeedItem }) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: "10px 0",
        borderBottom: `1px solid ${theme.stroke.tertiary}`,
      }}
    >
      <div
        style={{
          width: 3,
          borderRadius: 2,
          background: item.unread ? theme.accent.primary : theme.stroke.secondary,
          flexShrink: 0,
          alignSelf: "stretch",
        }}
      />
      <Stack gap={3} style={{ flex: 1, minWidth: 0 }}>
        <Row gap={6} align="center" wrap>
          {item.unread && (
            <Pill size="sm" active>
              NEW
            </Pill>
          )}
          {item.tag && <Pill size="sm">{item.tag}</Pill>}
          <Text tone="quaternary" size="small">
            {item.meta}
          </Text>
        </Row>
        <Link href={item.href}>{item.title}</Link>
        <Text tone="secondary" size="small">
          {item.preview}
        </Text>
      </Stack>
    </div>
  );
}

function ScheduleBlock() {
  const theme = useHostTheme();
  const rows = [
    ...CALENDAR_TODAY.map((e) => ({ ...e, day: "TODAY" })),
    ...CALENDAR_TOMORROW.map((e) => ({ ...e, day: "TOMORROW" })),
  ];
  return (
    <Table
      framed
      headers={["When", "Slot", "Event", "State"]}
      columnAlign={["left", "left", "left", "right"]}
      rows={rows.map((e) => [
        <Code>{e.day}</Code>,
        e.time,
        e.title,
        <Text
          size="small"
          style={{
            color: e.status === "done" ? theme.diff.stripAdded : theme.text.secondary,
          }}
        >
          {e.status === "done" ? "DONE" : "NEXT"}
        </Text>,
      ])}
    />
  );
}

function ProjectGrid() {
  const theme = useHostTheme();
  return (
    <Grid columns={2} gap={10}>
      {PROJECTS.map((p) => (
        <div
          style={{
            background: theme.bg.elevated,
            border: `1px solid ${theme.stroke.tertiary}`,
            borderRadius: 6,
            padding: 12,
          }}
        >
          <Row gap={8} align="center">
            <Swatch color={p.color} />
            <Text weight="semibold">{p.name}</Text>
          </Row>
          <Spacer size={8} />
          <UsageBar
            total={100}
            topRightLabel={`${p.load}%`}
            segments={[
              { id: `${p.name}-load`, value: p.load, color: p.color },
              { id: `${p.name}-rest`, value: 100 - p.load, color: "gray" },
            ]}
          />
          <Spacer size={6} />
          <Text tone="tertiary" size="small">
            {p.note}
          </Text>
        </div>
      ))}
    </Grid>
  );
}

function BriefView() {
  return (
    <Grid columns="1.1fr 0.9fr" gap={16}>
      <Stack gap={14}>
        <H2>Priorities</H2>
        <PriorityStack />
        <H2>Tasks</H2>
        <TaskCards />
      </Stack>
      <Stack gap={14}>
        <H2>Schedule</H2>
        <ScheduleBlock />
        <Callout tone="info" title="Demo mode">
          Connect MCPs and ask Agent to refresh. This template ships fictional data only.
        </Callout>
      </Stack>
    </Grid>
  );
}

function InboxView() {
  return (
    <Grid columns={2} gap={16}>
      <Stack gap={6}>
        <Row align="center" justify="space-between">
          <H3>Slack threads</H3>
          <Pill size="sm">{String(SLACK_THREADS.length)}</Pill>
        </Row>
        <Text tone="tertiary" size="small">
          Thread starts · click opens Slack
        </Text>
        <Stack gap={0}>
          {SLACK_THREADS.map((item) => (
            <FeedRow item={item} />
          ))}
        </Stack>
      </Stack>
      <Stack gap={6}>
        <Row align="center" justify="space-between">
          <H3>Email</H3>
          <Pill size="sm">{String(EMAILS.length)}</Pill>
        </Row>
        <Text tone="tertiary" size="small">
          Work inbox · click opens Gmail
        </Text>
        <Stack gap={0}>
          {EMAILS.map((item) => (
            <FeedRow item={item} />
          ))}
        </Stack>
      </Stack>
    </Grid>
  );
}

function OpsView() {
  return (
    <Stack gap={14}>
      <H2>Project matrix</H2>
      <ProjectGrid />
      <Divider />
      <H2>Link health</H2>
      <SourceRail />
      <Text tone="quaternary" size="small">
        github.com/aliyansami/cursor-work-dashboard · MIT · No secrets in repo
      </Text>
    </Stack>
  );
}

export default function WorkDashboard() {
  const [view, setView] = useCanvasState<ViewId>("jarvis-view", "brief");

  return (
    <Shell>
      <MissionHeader view={view} setView={setView} />
      <Stack gap={16}>
        <SignalStrip />
        <SourceRail />
        <Divider />
        {view === "brief" && <BriefView />}
        {view === "inbox" && <InboxView />}
        {view === "ops" && <OpsView />}
      </Stack>
    </Shell>
  );
}
