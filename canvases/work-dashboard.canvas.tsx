/**
 * Cursor Work Dashboard — PUBLIC TEMPLATE
 *
 * Demo data only. No real accounts, tokens, or private messages.
 * Ask your Agent: "Refresh the work dashboard from my Slack/Gmail/GitHub"
 * to replace DEMO_* rows with your live (local) data — never commit secrets.
 *
 * Canvas SDK: import only from "cursor/canvas".
 */
import type { ReactNode } from "react";
import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Code,
  CollapsibleSection,
  Divider,
  Grid,
  H1,
  H2,
  Link,
  Pill,
  Row,
  Spacer,
  Stack,
  Stat,
  Table,
  Text,
  useHostTheme,
} from "cursor/canvas";

const GENERATED_AT = "Demo snapshot · replace via Agent refresh";
const USER = "Your Name";
const EMAIL = "you@example.com";
const WORKSPACE = "Your Workspace";

type SourceStatus = "live" | "degraded" | "offline";

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
  {
    name: "Slack",
    account: "your-workspace",
    status: "offline",
    note: "Connect Slack MCP · then refresh",
  },
  {
    name: "Gmail",
    account: EMAIL,
    status: "offline",
    note: "Connect Gmail MCP · then refresh",
  },
  {
    name: "Google Calendar",
    account: EMAIL,
    status: "offline",
    note: "Connect Calendar MCP · then refresh",
  },
  {
    name: "GitHub",
    account: "your-github",
    status: "offline",
    note: "Add PAT in MCP settings (never commit it)",
  },
];

const HIGH_PRIORITY: WorkItem[] = [
  {
    id: "demo-hp-1",
    title: "Reproduce login 401 after token refresh",
    project: "Demo Backend",
    priority: "high",
    source: "Slack · #demo-backend",
    status: "Action required",
    detail: "DEMO · Users report 401 after refresh — investigate auth flow",
    href: "https://github.com",
  },
];

const TASKS: WorkItem[] = [
  {
    id: "demo-task-1",
    title: "Follow up PR #42 — Fix landing logo",
    project: "Demo Frontend",
    priority: "medium",
    source: "GitHub",
    status: "Open PR",
    detail: "DEMO · Replace with your open PRs on refresh",
    href: "https://github.com",
  },
];

const CALENDAR_TODAY = [
  {
    time: "10:00 – 10:30",
    title: "Team standup",
    organizer: "Demo Organizer",
    status: "upcoming",
  },
];

const CALENDAR_TOMORROW = [
  {
    time: "14:00 – 14:30",
    title: "Client sync",
    organizer: "Demo Organizer",
  },
];

const FYI: WorkItem[] = [
  {
    id: "demo-fyi-1",
    title: "Example security notice",
    project: "Unknown",
    priority: "low",
    source: "Gmail · automated",
    status: "No action",
    detail: "DEMO · Automated alerts belong in FYI, not Tasks",
  },
];

const PROJECTS = [
  {
    name: "DEMO BACKEND",
    high: 1,
    tasks: 0,
    update: "Sample project card — replaced when you refresh with live data.",
  },
  {
    name: "DEMO FRONTEND",
    high: 0,
    tasks: 1,
    update: "Sample open PR tracking.",
  },
];

const PRIORITIES = [
  "Connect Slack, Gmail, Calendar, and GitHub MCP (see docs/SETUP.md)",
  "Ask Agent: Refresh the work dashboard from my connected sources",
  "Optional: add the Jarvis rule from docs/JARVIS-RULE.md",
];

const SLACK_THREADS: FeedItem[] = [
  {
    id: "demo-s1",
    title: "#demo-backend",
    preview: "Alex: Can someone check the refresh-token 401s?",
    meta: "DEMO · thread start · click would open Slack",
    href: "https://slack.com",
    tag: "Demo",
  },
  {
    id: "demo-s2",
    title: "#demo-frontend",
    preview: "Sam: Logo looks cropped on mobile — thread started",
    meta: "DEMO · thread start only (not every reply)",
    href: "https://slack.com",
    tag: "Demo",
  },
];

const EMAILS: FeedItem[] = [
  {
    id: "demo-e1",
    title: "Invite: collaborate on demo/repo",
    preview: "Example actionable email — accept or decline",
    meta: "DEMO · click would open Gmail",
    href: "https://mail.google.com",
    tag: "Action?",
  },
  {
    id: "demo-e2",
    title: "Automated security alert",
    preview: "Example FYI — no reply required",
    meta: "DEMO · unread style",
    href: "https://mail.google.com",
    tag: "Security",
    unread: true,
  },
];

function statusPill(status: SourceStatus) {
  if (status === "live") return <Pill size="sm">LIVE</Pill>;
  if (status === "degraded") return <Pill size="sm">DEGRADED</Pill>;
  return <Pill size="sm">OFFLINE</Pill>;
}

function priorityTone(p: WorkItem["priority"]): "danger" | "warning" | undefined {
  if (p === "high") return "danger";
  if (p === "medium") return "warning";
  return undefined;
}

function Shell({ children }: { children: ReactNode }) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        minHeight: "100%",
        background: theme.bg.editor,
        color: theme.text.primary,
        fontFamily: "var(--vscode-font-family, system-ui, sans-serif)",
        padding: "20px 24px 32px",
      }}
    >
      {children}
    </div>
  );
}

function HeaderBar() {
  return (
    <div style={{ paddingBottom: 16, marginBottom: 12 }}>
      <Row align="center" justify="space-between" wrap>
        <Stack gap={4}>
          <Text tone="tertiary" size="small">
            CURSOR WORK DASHBOARD · TEMPLATE
          </Text>
          <H1>Today</H1>
          <Text tone="secondary">
            {USER} · <Code>{EMAIL}</Code> · {WORKSPACE}
          </Text>
        </Stack>
        <Stack gap={4}>
          <Row justify="end">
            <Pill size="sm">DEMO</Pill>
          </Row>
          <Text tone="tertiary" size="small">
            {GENERATED_AT}
          </Text>
        </Stack>
      </Row>
    </div>
  );
}

function SourceGrid() {
  return (
    <Grid columns={4} gap={12}>
      {SOURCES.map((s) => (
        <Card>
          <CardHeader trailing={statusPill(s.status)}>{s.name}</CardHeader>
          <CardBody>
            <Stack gap={4}>
              <Code>{s.account}</Code>
              <Text tone="tertiary" size="small">
                {s.note}
              </Text>
            </Stack>
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
}

function MetricsRow() {
  const actionable = HIGH_PRIORITY.length + TASKS.length;
  return (
    <Grid columns={4} gap={12}>
      <Stat value={actionable} label="Action items" tone="warning" />
      <Stat value={SLACK_THREADS.length} label="Slack threads" />
      <Stat value={EMAILS.length} label="Emails shown" />
      <Stat value={0} label="Sources live" />
    </Grid>
  );
}

function ItemTable({ items }: { items: WorkItem[] }) {
  if (items.length === 0) return null;
  return (
    <Table
      framed
      striped
      headers={["Item", "Project", "Priority", "Source", "Status"]}
      rows={items.map((item) => [
        <Stack gap={2}>
          {item.href ? (
            <Link href={item.href}>{item.title}</Link>
          ) : (
            <Text weight="semibold">{item.title}</Text>
          )}
          <Text tone="tertiary" size="small">
            {item.detail}
          </Text>
        </Stack>,
        item.project,
        <Stat value={item.priority.toUpperCase()} tone={priorityTone(item.priority)} label="" />,
        item.source,
        item.status,
      ])}
    />
  );
}

function FeedRow({ item }: { item: FeedItem }) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        borderBottom: `1px solid ${theme.stroke.tertiary}`,
        padding: "10px 0",
      }}
    >
      <Row align="start" justify="space-between" gap={12}>
        <Stack gap={3} style={{ flex: 1, minWidth: 0 }}>
          <Row gap={8} align="center" wrap>
            {item.unread && <Pill size="sm">UNREAD</Pill>}
            {item.tag && <Pill size="sm">{item.tag}</Pill>}
            <Text tone="tertiary" size="small">
              {item.meta}
            </Text>
          </Row>
          <Link href={item.href}>{item.title}</Link>
          <Text tone="secondary" size="small">
            {item.preview}
          </Text>
        </Stack>
        <Text tone="tertiary" size="small">
          Open
        </Text>
      </Row>
    </div>
  );
}

function FeedSection({
  title,
  count,
  hint,
  items,
}: {
  title: string;
  count: number;
  hint: string;
  items: FeedItem[];
}) {
  return (
    <Stack gap={4}>
      <Row align="center" justify="space-between" wrap>
        <Row gap={8} align="center">
          <Text weight="semibold">{title}</Text>
          <Pill size="sm">{String(count)}</Pill>
        </Row>
        <Text tone="tertiary" size="small">
          {hint}
        </Text>
      </Row>
      <Stack gap={0}>
        {items.map((item) => (
          <FeedRow item={item} />
        ))}
      </Stack>
    </Stack>
  );
}

function CalendarSection() {
  return (
    <CollapsibleSection
      title="Schedule"
      trailing={
        <Text size="small" tone="tertiary">
          Google Calendar
        </Text>
      }
      defaultOpen
    >
      <Stack gap={12}>
        <Text weight="semibold" size="small">
          Today
        </Text>
        <Table
          framed
          headers={["Time", "Event", "Organizer", "Status"]}
          rows={CALENDAR_TODAY.map((e) => [e.time, e.title, e.organizer, e.status])}
        />
        <Text weight="semibold" size="small">
          Tomorrow
        </Text>
        <Table
          framed
          headers={["Time", "Event", "Organizer"]}
          rows={CALENDAR_TOMORROW.map((e) => [e.time, e.title, e.organizer])}
        />
      </Stack>
    </CollapsibleSection>
  );
}

function ProjectOverview() {
  return (
    <CollapsibleSection title="Project overview" count={PROJECTS.length} defaultOpen>
      <Grid columns={2} gap={12}>
        {PROJECTS.map((p) => (
          <Card>
            <CardHeader
              trailing={
                <Row gap={6}>
                  {p.high > 0 && <Pill size="sm">{`${p.high} HIGH`}</Pill>}
                  <Pill size="sm">{`${p.tasks} tasks`}</Pill>
                </Row>
              }
            >
              {p.name}
            </CardHeader>
            <CardBody>
              <Text tone="secondary" size="small">
                {p.update}
              </Text>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </CollapsibleSection>
  );
}

function PrioritiesPanel() {
  const theme = useHostTheme();
  return (
    <Card>
      <CardHeader>Today&apos;s priorities</CardHeader>
      <CardBody>
        <Stack gap={8}>
          {PRIORITIES.map((p, i) => (
            <Row gap={12} align="start">
              <Text
                weight="bold"
                style={{
                  color: theme.accent.primary,
                  fontFamily: "var(--vscode-editor-font-family, monospace)",
                  minWidth: 20,
                }}
              >
                {`${i + 1}.`}
              </Text>
              <Text>{p}</Text>
            </Row>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export default function WorkDashboard() {
  return (
    <Shell>
      <HeaderBar />
      <Stack gap={20}>
        <MetricsRow />
        <SourceGrid />
        <Spacer size={4} />

        <Callout tone="info" title="Public template — demo data">
          Clone this repo, connect MCPs, then ask Agent to refresh. Do not commit
          PATs, OAuth secrets, or private messages. See README + docs/SETUP.md.
        </Callout>

        <H2>High priority</H2>
        <ItemTable items={HIGH_PRIORITY} />

        <H2>Tasks</H2>
        <ItemTable items={TASKS} />
        <Divider />

        <CalendarSection />
        <Divider />

        <H2>Inbox</H2>
        <Text tone="tertiary" size="small">
          Thread starts + emails · click opens Slack / Gmail (demo links for now)
        </Text>
        <FeedSection
          title="Slack threads"
          count={SLACK_THREADS.length}
          hint="Click → Slack"
          items={SLACK_THREADS}
        />
        <Spacer size={8} />
        <FeedSection
          title="Email"
          count={EMAILS.length}
          hint="Click → Gmail"
          items={EMAILS}
        />
        <Divider />

        <CollapsibleSection title="Important FYI" count={FYI.length}>
          <ItemTable items={FYI} />
        </CollapsibleSection>

        <ProjectOverview />
        <PrioritiesPanel />

        <Text tone="quaternary" size="small">
          github.com/aliyansami/cursor-work-dashboard · MIT · No secrets in repo
        </Text>
      </Stack>
    </Shell>
  );
}
