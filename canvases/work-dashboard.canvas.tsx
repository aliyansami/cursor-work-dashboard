/**
 * Cursor Work Dashboard — PUBLIC TEMPLATE
 *
 * Demo data only. No real accounts, tokens, or private messages.
 * Ask your Agent: "Refresh the work dashboard from my Slack/Gmail/GitHub"
 * to replace demo rows with your live data — never commit secrets.
 *
 * Views: Brief · Inbox · Wrap · Actions · Ops
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
  Select,
  Spacer,
  Stack,
  Stat,
  Swatch,
  Table,
  Text,
  TextArea,
  UsageBar,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";

const GENERATED_AT = "Demo snapshot · replace via Agent refresh";
const USER = "Your Name";
const EMAIL = "you@example.com";
const WORKSPACE = "Your Workspace";

type SourceStatus = "live" | "degraded" | "offline";
type ViewId = "brief" | "inbox" | "wrap" | "actions" | "ops";
type DraftChannel = "slack" | "gmail";
type ScopeId = "all" | "backend" | "frontend" | "client-a" | "internal" | "general";

type Scope = {
  id: ScopeId;
  short: string;
  /** Slack channel when this scope is channel-backed */
  slack?: string;
  project: string;
  color: "blue" | "orange" | "green" | "purple" | "red" | "yellow" | "gray";
};

interface SourceRow {
  name: string;
  account: string;
  status: SourceStatus;
  note: string;
  /** How to authenticate this MCP (shown when not live) */
  setup: string;
}

interface WorkItem {
  id: string;
  title: string;
  project: string;
  priority: "high" | "medium" | "low";
  source: string;
  status: string;
  detail: string;
  scope: ScopeId;
  href?: string;
}

type FeedItem = {
  id: string;
  title: string;
  preview: string;
  meta: string;
  href: string;
  scope: ScopeId;
  tag?: string;
  unread?: boolean;
};

type WrapItem = {
  id: string;
  title: string;
  detail: string;
  scope: ScopeId;
  href?: string;
};

type PriorityItem = {
  n: string;
  text: string;
  scope: ScopeId;
  href?: string;
};

type CalItem = {
  time: string;
  title: string;
  status: string;
  scope: ScopeId;
};

type DraftTarget = {
  id: string;
  channel: DraftChannel;
  label: string;
  where: string;
  from: string;
  when: string;
  replyTo: string;
  threadNote?: string;
  href: string;
  seed: string;
  scope: ScopeId;
};

type ProjectCard = {
  name: string;
  color: Scope["color"];
  load: number;
  note: string;
  scope: ScopeId;
};

const SCOPES: Scope[] = [
  { id: "all", short: "All", project: "All projects", color: "gray" },
  {
    id: "backend",
    short: "Backend",
    slack: "#demo-backend",
    project: "Demo Backend",
    color: "blue",
  },
  {
    id: "frontend",
    short: "Frontend",
    slack: "#demo-frontend",
    project: "Demo Frontend",
    color: "orange",
  },
  {
    id: "client-a",
    short: "Client A",
    slack: "#demo-client-a",
    project: "Client A",
    color: "green",
  },
  {
    id: "internal",
    short: "Internal",
    slack: "#demo-internal",
    project: "Internal",
    color: "purple",
  },
  { id: "general", short: "General", project: "General", color: "gray" },
];

const SOURCES: SourceRow[] = [
  {
    name: "Slack",
    account: "your-workspace",
    status: "offline",
    note: "Connect MCP",
    setup: "Settings → Tools & MCP → Slack → OAuth",
  },
  {
    name: "Gmail",
    account: EMAIL,
    status: "offline",
    note: "Connect MCP",
    setup: "Settings → Tools & MCP → Gmail → work Google account",
  },
  {
    name: "Calendar",
    account: EMAIL,
    status: "offline",
    note: "Connect MCP",
    setup: "Settings → Tools & MCP → Google Calendar",
  },
  {
    name: "GitHub",
    account: "your-github",
    status: "offline",
    note: "Add PAT in settings",
    setup: "Settings → Tools & MCP → GitHub → paste raw PAT (never commit)",
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
    detail: "DEMO · replace on refresh",
    scope: "frontend",
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
    scope: "backend",
    href: "https://slack.com",
  },
  {
    id: "demo-task-3",
    title: "Prep notes for Client A sync",
    project: "Client A",
    priority: "medium",
    source: "Calendar",
    status: "Prep",
    detail: "DEMO · tomorrow 14:00",
    scope: "client-a",
  },
];

const CALENDAR_TODAY: CalItem[] = [
  { time: "10:00–10:30", title: "Team standup", status: "done", scope: "internal" },
];

const CALENDAR_TOMORROW: CalItem[] = [
  { time: "14:00–14:30", title: "Client sync", status: "upcoming", scope: "client-a" },
  { time: "11:00–11:30", title: "Internal planning", status: "upcoming", scope: "internal" },
];

const PRIORITIES: PriorityItem[] = [
  {
    n: "01",
    text: "Connect Slack, Gmail, Calendar, GitHub MCP",
    scope: "general",
  },
  {
    n: "02",
    text: "Ask Agent to refresh this dashboard",
    scope: "general",
  },
  {
    n: "03",
    text: "Optional: add Jarvis rule from docs/JARVIS-RULE.md",
    scope: "general",
  },
];

const SLACK_THREADS: FeedItem[] = [
  {
    id: "demo-s1",
    title: "#demo-backend",
    preview: "Alex: Can someone check the refresh-token 401s?",
    meta: "DEMO · thread start",
    href: "https://slack.com",
    tag: "Backend",
    scope: "backend",
  },
  {
    id: "demo-s2",
    title: "#demo-frontend",
    preview: "Sam: Logo cropped on mobile — thread started",
    meta: "DEMO · thread start",
    href: "https://slack.com",
    tag: "Frontend",
    scope: "frontend",
  },
  {
    id: "demo-s3",
    title: "#demo-client-a",
    preview: "Taylor: Can we confirm the sync agenda for tomorrow?",
    meta: "DEMO · thread start",
    href: "https://slack.com",
    tag: "Client A",
    scope: "client-a",
  },
  {
    id: "demo-s4",
    title: "#demo-internal",
    preview: "Jordan: quick sync for 5min?",
    meta: "DEMO · thread start",
    href: "https://slack.com",
    tag: "Internal",
    scope: "internal",
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
    scope: "client-a",
  },
  {
    id: "demo-e2",
    title: "Automated security alert",
    preview: "Example FYI — no reply required",
    meta: "DEMO · unread",
    href: "https://mail.google.com",
    tag: "Sec",
    unread: true,
    scope: "general",
  },
  {
    id: "demo-e3",
    title: "Client A sync invite",
    preview: "Example calendar invite email",
    meta: "DEMO",
    href: "https://mail.google.com",
    tag: "Cal",
    scope: "client-a",
  },
];

const PROJECTS: ProjectCard[] = [
  { name: "Backend", color: "blue", load: 45, note: "Sample project card", scope: "backend" },
  { name: "Frontend", color: "orange", load: 30, note: "Sample open PR", scope: "frontend" },
  { name: "Client A", color: "green", load: 15, note: "Sync tomorrow", scope: "client-a" },
  { name: "Internal", color: "purple", load: 10, note: "Low activity", scope: "internal" },
];

/** End-of-day wrap — Agent replaces on "Hey Jarvis, wrap" */
const CLOSED_TODAY: WrapItem[] = [
  {
    id: "c1",
    title: "Standup attended",
    detail: "DEMO · calendar marked done",
    scope: "internal",
  },
  {
    id: "c2",
    title: "Replied in #demo-frontend logo thread",
    detail: "DEMO · sample closed Slack follow-up",
    scope: "frontend",
    href: "https://slack.com",
  },
];

const STILL_WAITING: WrapItem[] = [
  {
    id: "w1",
    title: "Auth fix from Alex on refresh-token 401s",
    detail: "DEMO · waiting · 1d",
    scope: "backend",
    href: "https://slack.com",
  },
  {
    id: "w2",
    title: "Reviewer on PR #42",
    detail: "DEMO · waiting · GitHub",
    scope: "frontend",
    href: "https://github.com",
  },
  {
    id: "w3",
    title: "Client A agenda confirmation",
    detail: "DEMO · waiting · Slack",
    scope: "client-a",
    href: "https://slack.com",
  },
];

const TOMORROW_TOP3: PriorityItem[] = [
  { n: "01", text: "Client sync at 14:00 — prep notes", scope: "client-a" },
  {
    n: "02",
    text: "Nudge PR #42 if still unreviewed",
    scope: "frontend",
    href: "https://github.com",
  },
  { n: "03", text: "Skim overnight Slack + security FYIs", scope: "general" },
];

const DRAFT_TARGETS: DraftTarget[] = [
  {
    id: "slack-demo-s1",
    channel: "slack",
    label: "#demo-backend · Alex 401s",
    where: "#demo-backend",
    from: "Alex",
    when: "DEMO",
    replyTo:
      "Can someone check the refresh-token 401s? Users are getting bounced after token refresh — unsure if it's expiry skew or a bad refresh path.",
    threadNote: "Thread start · no assignee yet",
    href: "https://slack.com",
    seed:
      "Hey Alex — looking into the refresh-token 401s now. Will update this thread once I can reproduce.",
    scope: "backend",
  },
  {
    id: "slack-demo-s2",
    channel: "slack",
    label: "#demo-frontend · logo thread",
    where: "#demo-frontend",
    from: "Sam",
    when: "DEMO",
    replyTo:
      "Logo cropped on mobile — looks like the hero image is clipping on smaller breakpoints.",
    threadNote: "Thread start · tied to PR #42",
    href: "https://slack.com",
    seed:
      "Sam — confirmed on mobile. I'll push a fix in PR #42 and ping when it's ready for review.",
    scope: "frontend",
  },
  {
    id: "gmail-demo-e1",
    channel: "gmail",
    label: "Invite: demo/repo",
    where: "Inbox · invite",
    from: "demo-collab@example.com",
    when: "DEMO",
    replyTo:
      "You've been invited to collaborate on demo/repo. Accept the invitation to get write access, or decline if this was unexpected.",
    threadNote: "Example actionable email",
    href: "https://mail.google.com",
    seed:
      "Thanks for the invite — I'll accept and confirm access shortly. Let me know if there's a preferred branch to start on.",
    scope: "client-a",
  },
];

function inScope<T extends { scope: ScopeId }>(items: T[], scope: ScopeId): T[] {
  if (scope === "all") return items;
  return items.filter((i) => i.scope === scope);
}

function scopeMeta(id: ScopeId): Scope {
  return SCOPES.find((s) => s.id === id) ?? SCOPES[0]!;
}

function actionCount(scope: ScopeId): number {
  return inScope(TASKS, scope).length + inScope(DRAFT_TARGETS, scope).length;
}

function shellStyle(theme: ReturnType<typeof useHostTheme>) {
  return {
    minHeight: "100%" as const,
    background: theme.bg.chrome,
    color: theme.text.primary,
    fontFamily: "var(--vscode-editor-font-family, ui-monospace, SFMono-Regular, Menlo, monospace)",
    padding: "16px 18px 28px",
  };
}

function panelStyle(theme: ReturnType<typeof useHostTheme>) {
  return {
    background: theme.bg.elevated,
    border: `1px solid ${theme.stroke.secondary}`,
    borderRadius: 8,
    padding: "14px 16px",
    marginBottom: 10,
  };
}

function Shell({ children }: { children: ReactNode }) {
  const theme = useHostTheme();
  return <div style={shellStyle(theme)}>{children}</div>;
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

function SetupCheck({ ok }: { ok: boolean }) {
  const theme = useHostTheme();
  return (
    <span
      style={{
        width: 20,
        height: 20,
        borderRadius: 6,
        border: `1.5px solid ${ok ? theme.diff.stripAdded : theme.stroke.secondary}`,
        background: ok ? theme.diff.stripAdded : theme.fill.quaternary,
        color: theme.bg.chrome,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      {ok ? "✓" : ""}
    </span>
  );
}

function MissionHeader({ view, setView }: { view: ViewId; setView: (v: ViewId) => void }) {
  const theme = useHostTheme();
  const tabs: { id: ViewId; label: string }[] = [
    { id: "brief", label: "Brief" },
    { id: "inbox", label: "Inbox" },
    { id: "wrap", label: "Wrap" },
    { id: "actions", label: "Actions" },
    { id: "ops", label: "Ops" },
  ];
  return (
    <div style={panelStyle(theme)}>
      <Row align="center" justify="space-between" wrap gap={12}>
        <Stack gap={4}>
          <Row gap={8} align="center" wrap>
            <Text
              size="small"
              weight="semibold"
              style={{
                letterSpacing: "0.14em",
                color: theme.accent.primary,
              }}
            >
              JARVIS // OPS
            </Text>
            <Pill size="sm" active>
              LIVE
            </Pill>
          </Row>
          <H1 style={{ margin: 0 }}>Command center</H1>
          <Text tone="secondary" size="small">
            {USER} · <Code>{WORKSPACE}</Code> · {GENERATED_AT}
          </Text>
        </Stack>
        <Row gap={6} wrap>
          {tabs.map((t) => (
            <Button
              variant={view === t.id ? "primary" : "secondary"}
              onClick={() => setView(t.id)}
            >
              {t.label}
            </Button>
          ))}
        </Row>
      </Row>
    </div>
  );
}

function SetupChecklist() {
  const theme = useHostTheme();
  const live = SOURCES.filter((s) => s.status === "live").length;
  const ready = live === SOURCES.length;
  return (
    <Stack gap={10}>
      <Row align="center" justify="space-between" wrap gap={8}>
        <H2>Setup checklist</H2>
        <Pill size="sm" active={ready}>
          {live}/{SOURCES.length} MCP READY
        </Pill>
      </Row>
      <Text tone="tertiary" size="small">
        Green check = authenticated. Agent sets status to live on refresh after you connect each MCP.
      </Text>
      <Stack gap={0}>
        {SOURCES.map((s) => {
          const ok = s.status === "live";
          return (
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                padding: "12px 0",
                borderBottom: `1px solid ${theme.stroke.tertiary}`,
              }}
            >
              <SetupCheck ok={ok} />
              <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                <Row gap={8} align="center" wrap>
                  <Text weight="semibold">{s.name}</Text>
                  <Pill size="sm">{s.status.toUpperCase()}</Pill>
                </Row>
                <Text tone="secondary" size="small">
                  {s.account} · {s.note}
                </Text>
                {!ok && (
                  <Text tone="quaternary" size="small">
                    Setup · {s.setup}
                  </Text>
                )}
              </Stack>
            </div>
          );
        })}
      </Stack>
      {ready ? (
        <Callout tone="success" title="All links up">
          Slack, Gmail, Calendar, and GitHub are live. Say &quot;Hey Jarvis, refresh&quot; anytime.
        </Callout>
      ) : (
        <Callout tone="warning" title="Finish MCP setup">
          Connect remaining sources in Cursor Settings → Tools & MCP, then ask Agent to refresh this
          checklist.
        </Callout>
      )}
    </Stack>
  );
}

function ChannelSwitcher({
  scope,
  setScope,
}: {
  scope: ScopeId;
  setScope: (s: ScopeId) => void;
}) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        background: theme.fill.tertiary,
        border: `1px solid ${theme.stroke.tertiary}`,
        borderRadius: 8,
        padding: "10px 12px",
        marginBottom: 14,
      }}
    >
      <Row align="center" justify="space-between" wrap gap={8}>
        <Text size="small" tone="tertiary" weight="medium">
          SLACK / PROJECT
        </Text>
        <Text size="small" tone="quaternary">
          Select a project → filter tasks, inbox, wrap, drafts
        </Text>
      </Row>
      <Spacer size={8} />
      <Select
        value={scope}
        onChange={(v) => setScope(v as ScopeId)}
        placeholder="All projects"
        style={{ width: "100%", maxWidth: 420 }}
        options={SCOPES.map((s) => {
          const actions = actionCount(s.id);
          const base = s.slack ? `${s.short} · ${s.slack}` : s.short;
          return {
            value: s.id,
            label: actions > 0 ? `${base} · ${actions}` : base,
          };
        })}
      />
      {scope !== "all" && (
        <>
          <Spacer size={8} />
          <Row gap={8} align="center" wrap>
            <Swatch color={scopeMeta(scope).color} />
            <Text weight="semibold" size="small">
              {scopeMeta(scope).project}
            </Text>
            {scopeMeta(scope).slack ? (
              <Code>{scopeMeta(scope).slack}</Code>
            ) : (
              <Text tone="tertiary" size="small">
                No dedicated Slack channel · email / calendar / GitHub
              </Text>
            )}
            {actionCount(scope) > 0 ? (
              <Pill size="sm" active>
                {actionCount(scope)} ACTIONS
              </Pill>
            ) : (
              <Pill size="sm">NO ACTIONS</Pill>
            )}
          </Row>
        </>
      )}
    </div>
  );
}

function SignalStrip({ scope }: { scope: ScopeId }) {
  const theme = useHostTheme();
  const live = SOURCES.filter((s) => s.status === "live").length;
  const tasks = inScope(TASKS, scope).length;
  const waiting = inScope(STILL_WAITING, scope).length;
  const closed = inScope(CLOSED_TODAY, scope).length;
  const drafts = inScope(DRAFT_TARGETS, scope).length;
  return (
    <Stack gap={10}>
      <Grid columns={4} gap={10}>
        <Stat value={tasks} label="Actions" tone={tasks ? "warning" : undefined} />
        <Stat value={waiting} label="Waiting" tone={waiting ? "warning" : undefined} />
        <Stat value={closed} label="Closed" tone={closed ? "success" : undefined} />
        <Stat
          value={scope === "all" ? `${live}/4` : String(drafts)}
          label={scope === "all" ? "Links up" : "Drafts"}
          tone={scope === "all" ? undefined : drafts ? "warning" : undefined}
        />
      </Grid>
      <div style={{ background: theme.fill.tertiary, borderRadius: 6, padding: "10px 12px" }}>
        <Text size="small" tone="tertiary" weight="medium">
          ATTENTION LOAD
          {scope !== "all" ? ` · ${scopeMeta(scope).short.toUpperCase()}` : ""}
        </Text>
        <Spacer size={6} />
        <UsageBar
          total={Math.max(tasks + waiting + drafts + 1, 1)}
          topLeftLabel="Attention mix"
          topRightLabel="demo"
          segments={[
            { id: "tasks", value: Math.max(tasks, 0), color: "orange" },
            { id: "wait", value: Math.max(waiting, 0), color: "blue" },
            { id: "drafts", value: Math.max(drafts, 0), color: "red" },
            { id: "clear", value: 1, color: "green" },
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

function PriorityStack({ items }: { items: PriorityItem[] }) {
  const theme = useHostTheme();
  if (items.length === 0) return null;
  return (
    <Stack gap={0}>
      {items.map((p, i) => (
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
              {String(i + 1).padStart(2, "0")}
            </Text>
            {p.href ? <Link href={p.href}>{p.text}</Link> : <Text weight="medium">{p.text}</Text>}
          </Row>
        </div>
      ))}
    </Stack>
  );
}

function TaskCards({ items }: { items: WorkItem[] }) {
  const theme = useHostTheme();
  if (items.length === 0) return null;
  return (
    <Stack gap={8}>
      {items.map((t) => (
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

function WrapList({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "closed" | "waiting";
  items: WrapItem[];
}) {
  const theme = useHostTheme();
  if (items.length === 0) return null;
  const rail = tone === "closed" ? theme.diff.stripAdded : theme.accent.primary;
  return (
    <Stack gap={6}>
      <Row align="center" justify="space-between">
        <H3>{title}</H3>
        <Pill size="sm">{String(items.length)}</Pill>
      </Row>
      <Stack gap={0}>
        {items.map((item) => (
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
                background: rail,
                flexShrink: 0,
                alignSelf: "stretch",
              }}
            />
            <Stack gap={2} style={{ flex: 1 }}>
              {item.href ? (
                <Link href={item.href}>{item.title}</Link>
              ) : (
                <Text weight="medium">{item.title}</Text>
              )}
              <Text tone="secondary" size="small">
                {item.detail}
              </Text>
            </Stack>
          </div>
        ))}
      </Stack>
    </Stack>
  );
}

function ScheduleBlock({
  today,
  tomorrow,
}: {
  today: CalItem[];
  tomorrow: CalItem[];
}) {
  const theme = useHostTheme();
  const rows = [
    ...today.map((e) => ({ ...e, day: "TODAY" })),
    ...tomorrow.map((e) => ({ ...e, day: "TOMORROW" })),
  ];
  if (rows.length === 0) return null;
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

function ProjectGrid({ items }: { items: ProjectCard[] }) {
  const theme = useHostTheme();
  if (items.length === 0) return null;
  return (
    <Grid columns={2} gap={10}>
      {items.map((p) => (
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

function EmptyScope({ scope, label }: { scope: ScopeId; label: string }) {
  if (scope === "all") return null;
  return (
    <Callout tone="neutral" title={`${scopeMeta(scope).short} · ${label}`}>
      Nothing in this slice right now. Switch channel or ask Agent to refresh from live sources.
    </Callout>
  );
}

function BriefView({ scope }: { scope: ScopeId }) {
  const priorities = inScope(PRIORITIES, scope);
  const tasks = inScope(TASKS, scope);
  const today = inScope(CALENDAR_TODAY, scope);
  const tomorrow = inScope(CALENDAR_TOMORROW, scope);
  const empty = priorities.length === 0 && tasks.length === 0 && today.length === 0 && tomorrow.length === 0;

  return (
    <Grid columns="1.1fr 0.9fr" gap={16}>
      <Stack gap={14}>
        {priorities.length > 0 && (
          <>
            <H2>Priorities</H2>
            <PriorityStack items={priorities} />
          </>
        )}
        {tasks.length > 0 && (
          <>
            <H2>Tasks</H2>
            <TaskCards items={tasks} />
          </>
        )}
        {empty && <EmptyScope scope={scope} label="brief" />}
      </Stack>
      <Stack gap={14}>
        {(today.length > 0 || tomorrow.length > 0) && (
          <>
            <H2>Schedule</H2>
            <ScheduleBlock today={today} tomorrow={tomorrow} />
          </>
        )}
        {scope === "all" && (
          <Callout tone="info" title="Demo mode">
            Connect MCPs and ask Agent to refresh. This template ships fictional data only — use the
            channel switcher to focus a project.
          </Callout>
        )}
      </Stack>
    </Grid>
  );
}

function InboxView({ scope }: { scope: ScopeId }) {
  const slack = inScope(SLACK_THREADS, scope);
  const emails = inScope(EMAILS, scope);
  const empty = slack.length === 0 && emails.length === 0;

  return (
    <Stack gap={16}>
      {empty && <EmptyScope scope={scope} label="inbox" />}
      <Grid columns={2} gap={16}>
        {slack.length > 0 && (
          <Stack gap={6}>
            <Row align="center" justify="space-between">
              <H3>Slack threads</H3>
              <Pill size="sm">{String(slack.length)}</Pill>
            </Row>
            <Text tone="tertiary" size="small">
              Thread starts · click opens Slack
            </Text>
            <Stack gap={0}>
              {slack.map((item) => (
                <FeedRow item={item} />
              ))}
            </Stack>
          </Stack>
        )}
        {emails.length > 0 && (
          <Stack gap={6}>
            <Row align="center" justify="space-between">
              <H3>Email</H3>
              <Pill size="sm">{String(emails.length)}</Pill>
            </Row>
            <Text tone="tertiary" size="small">
              Work inbox · click opens Gmail
            </Text>
            <Stack gap={0}>
              {emails.map((item) => (
                <FeedRow item={item} />
              ))}
            </Stack>
          </Stack>
        )}
      </Grid>
    </Stack>
  );
}

function WrapView({ scope }: { scope: ScopeId }) {
  const closed = inScope(CLOSED_TODAY, scope);
  const waiting = inScope(STILL_WAITING, scope);
  const tomorrow = inScope(TOMORROW_TOP3, scope);
  const cal = inScope(CALENDAR_TOMORROW, scope);
  const empty = closed.length === 0 && waiting.length === 0 && tomorrow.length === 0;

  return (
    <Stack gap={16}>
      <Callout tone="info" title="End-of-day wrap">
        Filtered by channel/project switcher. Say &quot;Hey Jarvis, wrap&quot; to rebuild Closed /
        Waiting / Tomorrow top 3 from live sources. Never invent completions — only mark closed when
        CONFIRMED.
      </Callout>
      {empty && <EmptyScope scope={scope} label="wrap" />}
      <Grid columns={2} gap={16}>
        <WrapList title="Closed today" tone="closed" items={closed} />
        <WrapList title="Still waiting" tone="waiting" items={waiting} />
      </Grid>
      {tomorrow.length > 0 && (
        <>
          <Divider />
          <H2>Tomorrow · top 3</H2>
          <PriorityStack items={tomorrow} />
        </>
      )}
      {cal.length > 0 && (
        <>
          <H3>Tomorrow schedule</H3>
          <Table framed headers={["Slot", "Event"]} rows={cal.map((e) => [e.time, e.title])} />
        </>
      )}
    </Stack>
  );
}

function ReplyContextCard({ target }: { target: DraftTarget }) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        background: theme.bg.elevated,
        border: `1px solid ${theme.stroke.secondary}`,
        borderLeft: `3px solid ${theme.accent.primary}`,
        borderRadius: 6,
        padding: "12px 14px",
      }}
    >
      <Row gap={8} align="center" wrap>
        <Pill size="sm" active>
          REPLYING TO
        </Pill>
        <Pill size="sm">{target.channel === "slack" ? "Slack" : "Gmail"}</Pill>
        <Text tone="quaternary" size="small">
          {target.when}
        </Text>
      </Row>
      <Spacer size={8} />
      <Text weight="semibold" size="small">
        {target.from}
      </Text>
      <Text tone="tertiary" size="small">
        {target.where}
      </Text>
      <Spacer size={8} />
      <div
        style={{
          background: theme.fill.tertiary,
          borderRadius: 4,
          padding: "10px 12px",
        }}
      >
        <Text tone="secondary" style={{ whiteSpace: "pre-wrap" }}>
          {target.replyTo}
        </Text>
      </div>
      {target.threadNote ? (
        <>
          <Spacer size={8} />
          <Text tone="quaternary" size="small">
            Thread · {target.threadNote}
          </Text>
        </>
      ) : null}
      <Spacer size={8} />
      <Link href={target.href}>Open original</Link>
    </div>
  );
}

function ActionsView({ scope }: { scope: ScopeId }) {
  const theme = useHostTheme();
  const drafts = inScope(DRAFT_TARGETS, scope);
  const relatedTasks = inScope(TASKS, scope);
  const defaultId = drafts[0]?.id ?? "";
  const [targetId, setTargetId] = useCanvasState<string>("draft-target", defaultId);
  const activeId = drafts.some((d) => d.id === targetId) ? targetId : defaultId;
  const target = drafts.find((t) => t.id === activeId) ?? drafts[0];
  const [body, setBody] = useCanvasState<string>("draft-body", target?.seed ?? "");
  const [status, setStatus] = useCanvasState<"idle" | "ready">("draft-status", "idle");

  const channelLabel = target?.channel === "gmail" ? "Gmail draft" : "Slack draft";

  if (drafts.length === 0) {
    return (
      <Stack gap={14}>
        <Callout tone="warning" title="Draft only">
          Canvas stores the text here. Ask Agent to create the Slack/Gmail draft via MCP — never send
          unless you explicitly say send.
        </Callout>
        {relatedTasks.length > 0 && (
          <>
            <H2>Actions in this project</H2>
            <TaskCards items={relatedTasks} />
          </>
        )}
        <EmptyScope scope={scope === "all" ? "general" : scope} label="drafts" />
        {scope !== "all" && relatedTasks.length === 0 && (
          <Text tone="tertiary" size="small">
            No draft targets for {scopeMeta(scope).short}. Switch channel or ask Agent to add one.
          </Text>
        )}
      </Stack>
    );
  }

  return (
    <Stack gap={14}>
      <Callout tone="warning" title="Draft only">
        Canvas stores the text here. Ask Agent to create the Slack/Gmail draft via MCP — never send
        unless you explicitly say send.
      </Callout>

      {relatedTasks.length > 0 && (
        <Stack gap={8}>
          <H3>Project actions</H3>
          <TaskCards items={relatedTasks} />
        </Stack>
      )}

      {target && <ReplyContextCard target={target} />}

      <Grid columns="0.9fr 1.1fr" gap={16}>
        <Stack gap={10}>
          <H3>Target</H3>
          <Select
            value={activeId}
            onChange={(v) => {
              setTargetId(v);
              const next = drafts.find((t) => t.id === v);
              if (next) {
                setBody(next.seed);
                setStatus("idle");
              }
            }}
            options={drafts.map((t) => ({
              value: t.id,
              label: `${t.channel === "slack" ? "Slack" : "Gmail"} · ${t.label}`,
            }))}
          />
          <Divider />
          <Text size="small" tone="tertiary">
            Agent prompt (copy / say)
          </Text>
          <div
            style={{
              background: theme.fill.tertiary,
              borderRadius: 6,
              padding: 10,
            }}
          >
            <Text size="small">
              Draft a {channelLabel} replying to {target?.from} in &quot;{target?.where}&quot; about: &quot;
              {target?.replyTo.slice(0, 120)}
              {(target?.replyTo.length ?? 0) > 120 ? "…" : ""}
              &quot;. Use the compose body. Create draft only — do not send.
            </Text>
          </div>
        </Stack>

        <Stack gap={10}>
          <Row align="center" justify="space-between">
            <H3>Your reply</H3>
            <Pill size="sm" active={status === "ready"}>
              {status === "ready" ? "DRAFT READY" : "NOT SENT"}
            </Pill>
          </Row>
          <TextArea
            value={body}
            onChange={(v) => {
              setBody(v);
              setStatus("idle");
            }}
            rows={8}
            placeholder="Write the reply…"
          />
          <Row gap={8} wrap>
            <Button
              variant="secondary"
              onClick={() => {
                if (target) setBody(target.seed);
                setStatus("idle");
              }}
            >
              Reset seed
            </Button>
            <Button variant="primary" onClick={() => setStatus("ready")}>
              Mark draft ready
            </Button>
          </Row>
          <Text tone="quaternary" size="small">
            Mark ready after Agent creates the MCP draft. Still never auto-sends.
          </Text>
        </Stack>
      </Grid>
    </Stack>
  );
}

function OpsView({ scope, setScope }: { scope: ScopeId; setScope: (s: ScopeId) => void }) {
  const projects = inScope(PROJECTS, scope);
  return (
    <Stack gap={14}>
      <SetupChecklist />
      <Divider />
      <H2>Project matrix</H2>
      <ProjectGrid items={projects.length ? projects : PROJECTS} />
      <Divider />
      <H2>Jump to channel</H2>
      <Row gap={6} wrap>
        {SCOPES.filter((s) => s.id !== "all").map((s) => (
          <Button
            variant={scope === s.id ? "primary" : "secondary"}
            onClick={() => setScope(s.id)}
          >
            {s.short}
            {actionCount(s.id) > 0 ? ` · ${actionCount(s.id)}` : ""}
          </Button>
        ))}
      </Row>
      <Divider />
      <H2>Link health</H2>
      <SourceRail />
      <Divider />
      <H2>Automation</H2>
      <Callout tone="info" title="Morning refresh">
        See <Code>docs/AUTOMATION.md</Code> — sessionStart hook (local morning window) + optional
        Cursor Automation at 09:00. Say &quot;Hey Jarvis, wrap&quot; for end-of-day.
      </Callout>
      <Text tone="quaternary" size="small">
        github.com/aliyansami/cursor-work-dashboard · MIT · No secrets in repo
      </Text>
    </Stack>
  );
}

export default function WorkDashboard() {
  const [view, setView] = useCanvasState<ViewId>("jarvis-view", "brief");
  const [scope, setScope] = useCanvasState<ScopeId>("jarvis-scope", "all");

  return (
    <Shell>
      <MissionHeader view={view} setView={setView} />
      <ChannelSwitcher scope={scope} setScope={setScope} />
      <Stack gap={16}>
        <SignalStrip scope={scope} />
        <SourceRail />
        <Divider />
        {view === "brief" && <BriefView scope={scope} />}
        {view === "inbox" && <InboxView scope={scope} />}
        {view === "wrap" && <WrapView scope={scope} />}
        {view === "actions" && <ActionsView scope={scope} />}
        {view === "ops" && <OpsView scope={scope} setScope={setScope} />}
      </Stack>
    </Shell>
  );
}
