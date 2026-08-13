import { inScope, scopeMeta } from "../data/loadDashboard";
import { useDashboard } from "../context";
import { ClearedBar } from "./ClearToggle";
import { FeedRow, PriorityStack, TaskCards, WrapList } from "./Lists";
import {
  Callout,
  Code,
  Divider,
  ExtLink,
  H2,
  H3,
  Pill,
  Row,
  Spacer,
  Stack,
  Swatch,
  Text,
} from "./ui";
import { useEffect, useState } from "react";
import type { DraftTarget } from "../types";

function EmptyScope({ label }: { label: string }) {
  const { data, scope } = useDashboard();
  if (scope === "all") return null;
  return (
    <Callout tone="neutral" title={`${scopeMeta(data.scopes, scope).short} · ${label}`}>
      Nothing in this slice right now. Switch channel or ask Agent to refresh from live sources.
    </Callout>
  );
}

export function BriefView() {
  const { data, scope, cleared } = useDashboard();
  const priorities = cleared.visible(inScope(data.priorities, scope));
  const tasks = cleared.visible(inScope(data.tasks, scope));
  const today = inScope(data.calendarToday, scope);
  const tomorrow = inScope(data.calendarTomorrow, scope);
  const empty =
    priorities.length === 0 &&
    tasks.length === 0 &&
    today.length === 0 &&
    tomorrow.length === 0;

  return (
    <Stack gap={12}>
      <ClearedBar />
      <div className="grid-2">
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
          {empty && <EmptyScope label="brief" />}
        </Stack>
        <Stack gap={14}>
          {(today.length > 0 || tomorrow.length > 0) && (
            <>
              <H2>Schedule</H2>
              <table className="table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Slot</th>
                    <th>Event</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...today.map((e) => ({ ...e, day: "TODAY" })),
                    ...tomorrow.map((e) => ({ ...e, day: "TOMORROW" })),
                  ].map((e) => (
                    <tr key={`${e.day}-${e.time}-${e.title}`}>
                      <td>
                        <Code>{e.day}</Code>
                      </td>
                      <td>{e.time}</td>
                      <td>{e.title}</td>
                      <td
                        className="text-sm"
                        style={{
                          color:
                            e.status === "done"
                              ? "var(--success)"
                              : "var(--text-secondary)",
                        }}
                      >
                        {e.status === "done" ? "DONE" : "NEXT"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {scope === "all" && (
            <Callout tone="info" title="Ops console">
              Hit the checkmark to clear handled items. Agent refreshes{" "}
              <Code>web/public/data/dashboard.json</Code> — keep stable ids so clears survive.
            </Callout>
          )}
        </Stack>
      </div>
    </Stack>
  );
}

export function InboxView() {
  const { data, scope, cleared } = useDashboard();
  const slack = cleared.visible(inScope(data.slackThreads, scope));
  const emails = cleared.visible(inScope(data.emails, scope));
  const empty = slack.length === 0 && emails.length === 0;

  return (
    <Stack gap={16}>
      <ClearedBar />
      {empty && <EmptyScope label="inbox" />}
      <div className="grid-2">
        {slack.length > 0 && (
          <Stack gap={6}>
            <Row between>
              <H3>Slack threads</H3>
              <Pill>{String(slack.length)}</Pill>
            </Row>
            <Text tone="tertiary" size="small">
              Thread starts · Clear after you cater · click opens Slack
            </Text>
            <Stack gap={0}>
              {slack.map((item) => (
                <FeedRow key={item.id} item={item} />
              ))}
            </Stack>
          </Stack>
        )}
        {emails.length > 0 && (
          <Stack gap={6}>
            <Row between>
              <H3>Email</H3>
              <Pill>{String(emails.length)}</Pill>
            </Row>
            <Text tone="tertiary" size="small">
              Work inbox · Clear after handled · click opens Gmail
            </Text>
            <Stack gap={0}>
              {emails.map((item) => (
                <FeedRow key={item.id} item={item} />
              ))}
            </Stack>
          </Stack>
        )}
      </div>
    </Stack>
  );
}

export function WrapView() {
  const { data, scope, cleared } = useDashboard();
  const closed = inScope(data.closedToday, scope);
  const waiting = cleared.visible(inScope(data.stillWaiting, scope));
  const tomorrow = cleared.visible(inScope(data.tomorrowTop3, scope));
  const cal = inScope(data.calendarTomorrow, scope);
  const empty = closed.length === 0 && waiting.length === 0 && tomorrow.length === 0;

  return (
    <Stack gap={16}>
      <ClearedBar />
      <Callout tone="info" title="End-of-day wrap">
        Filtered by channel/project switcher. Clear waiting items you already chased. Say &quot;Hey
        Jarvis, wrap&quot; to rebuild from live sources.
      </Callout>
      {empty && <EmptyScope label="wrap" />}
      <div className="grid-2">
        <WrapList title="Closed today" tone="closed" items={closed} />
        <WrapList title="Still waiting" tone="waiting" items={waiting} />
      </div>
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
          <table className="table">
            <thead>
              <tr>
                <th>Slot</th>
                <th>Event</th>
              </tr>
            </thead>
            <tbody>
              {cal.map((e) => (
                <tr key={`${e.time}-${e.title}`}>
                  <td>{e.time}</td>
                  <td>{e.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Stack>
  );
}

function ReplyContextCard({ target }: { target: DraftTarget }) {
  return (
    <div
      className="task-card"
      style={{ borderLeftColor: "var(--accent)", marginBottom: 0 }}
    >
      <div className="row row-wrap" style={{ gap: 8 }}>
        <Pill active>REPLYING TO</Pill>
        <Pill>{target.channel === "slack" ? "Slack" : "Gmail"}</Pill>
        <Text tone="quaternary" size="small">
          {target.when}
        </Text>
      </div>
      <Spacer size={8} />
      <Text weight="semibold" size="small">
        {target.from}
      </Text>
      <Text tone="tertiary" size="small">
        {target.where}
      </Text>
      <Spacer size={8} />
      <div className="quote-box">
        <Text tone="secondary">{target.replyTo}</Text>
      </div>
      {target.threadNote && (
        <>
          <Spacer size={8} />
          <Text tone="quaternary" size="small">
            Thread · {target.threadNote}
          </Text>
        </>
      )}
      <Spacer size={8} />
      <ExtLink href={target.href}>Open original</ExtLink>
    </div>
  );
}

export function ActionsView() {
  const { data, scope, cleared } = useDashboard();
  const drafts = cleared.visible(inScope(data.draftTargets, scope));
  const relatedTasks = cleared.visible(inScope(data.tasks, scope));
  const defaultId = drafts[0]?.id ?? "";
  const [targetId, setTargetId] = useState(defaultId);
  const activeId = drafts.some((d) => d.id === targetId) ? targetId : defaultId;
  const target = drafts.find((t) => t.id === activeId) ?? drafts[0];
  const [body, setBody] = useState(target?.seed ?? "");
  const [status, setStatus] = useState<"idle" | "ready">("idle");

  useEffect(() => {
    if (target) setBody(target.seed);
    setStatus("idle");
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const channelLabel = target?.channel === "gmail" ? "Gmail draft" : "Slack draft";

  if (drafts.length === 0) {
    return (
      <Stack gap={14}>
        <ClearedBar />
        <Callout tone="warning" title="Draft only">
          Ask Agent to create Slack/Gmail drafts via MCP — never send unless you say send.
        </Callout>
        {relatedTasks.length > 0 && (
          <>
            <H2>Actions in this project</H2>
            <TaskCards items={relatedTasks} />
          </>
        )}
        <EmptyScope label="drafts" />
      </Stack>
    );
  }

  return (
    <Stack gap={14}>
      <ClearedBar />
      <Callout tone="warning" title="Draft only">
        Ask Agent to create the Slack/Gmail draft via MCP — never send unless you explicitly say
        send.
      </Callout>
      {relatedTasks.length > 0 && (
        <Stack gap={8}>
          <H3>Project actions</H3>
          <TaskCards items={relatedTasks} />
        </Stack>
      )}
      {target && <ReplyContextCard target={target} />}
      <div className="grid-2">
        <Stack gap={10}>
          <H3>Target</H3>
          <select
            className="select"
            value={activeId}
            onChange={(e) => {
              setTargetId(e.target.value);
              const next = drafts.find((t) => t.id === e.target.value);
              if (next) {
                setBody(next.seed);
                setStatus("idle");
              }
            }}
          >
            {drafts.map((t) => (
              <option key={t.id} value={t.id}>
                {t.channel === "slack" ? "Slack" : "Gmail"} · {t.label}
              </option>
            ))}
          </select>
          <Divider />
          <Text size="small" tone="tertiary">
            Agent prompt
          </Text>
          <div className="quote-box">
            <Text size="small">
              Draft a {channelLabel} replying to {target?.from} in &quot;{target?.where}&quot;
              about: &quot;{target?.replyTo.slice(0, 120)}
              {(target?.replyTo.length ?? 0) > 120 ? "…" : ""}&quot;. Create draft only — do not
              send.
            </Text>
          </div>
        </Stack>
        <Stack gap={10}>
          <Row between>
            <H3>Your reply</H3>
            <Pill active={status === "ready"}>
              {status === "ready" ? "DRAFT READY" : "NOT SENT"}
            </Pill>
          </Row>
          <textarea
            className="textarea"
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              setStatus("idle");
            }}
            rows={8}
            placeholder="Write the reply…"
          />
          <div className="row row-wrap" style={{ gap: 8 }}>
            <button
              type="button"
              className="btn"
              onClick={() => {
                if (target) setBody(target.seed);
                setStatus("idle");
              }}
            >
              Reset seed
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setStatus("ready")}>
              Mark draft ready
            </button>
            {target && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  cleared.clear(target.id);
                  setStatus("idle");
                }}
              >
                Done · clear
              </button>
            )}
          </div>
        </Stack>
      </div>
    </Stack>
  );
}

export function OpsView() {
  const { data, scope, setScope, cleared } = useDashboard();
  const projects = inScope(data.projects, scope);
  const list = projects.length ? projects : data.projects;
  const live = data.sources.filter((s) => s.status === "live").length;
  const ready = live === data.sources.length;

  return (
    <Stack gap={14}>
      <ClearedBar />
      <Stack gap={10}>
        <Row between wrap gap={8}>
          <H2>Setup checklist</H2>
          <Pill active={ready}>
            {live}/{data.sources.length} MCP READY
          </Pill>
        </Row>
        <Text tone="tertiary" size="small">
          Green check = authenticated. Agent sets status to live on refresh after you connect each
          MCP.
        </Text>
        <Stack gap={0}>
          {data.sources.map((s) => {
            const ok = s.status === "live";
            return (
              <div
                key={s.name}
                className="row row-start"
                style={{
                  gap: 12,
                  padding: "12px 0",
                  borderBottom: "1px solid var(--stroke-tertiary)",
                }}
              >
                <span className={`setup-check${ok ? " ok" : ""}`}>{ok ? "✓" : ""}</span>
                <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                  <Row wrap gap={8}>
                    <Text weight="semibold">{s.name}</Text>
                    <Pill>{s.status.toUpperCase()}</Pill>
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
            Connect remaining sources in Cursor Settings → Tools & MCP, then ask Agent to refresh.
          </Callout>
        )}
      </Stack>
      <Divider />
      <H2>Project matrix</H2>
      <div className="grid-projects">
        {list.map((p) => (
          <div key={p.name} className="project-card">
            <Row gap={8}>
              <Swatch color={p.color} />
              <Text weight="semibold">{p.name}</Text>
            </Row>
            <Spacer size={8} />
            <div className="usage-track">
              <div
                className={`usage-seg swatch-${p.color}`}
                style={{ width: `${p.load}%` }}
              />
            </div>
            <Spacer size={6} />
            <Text tone="tertiary" size="small">
              {p.note}
            </Text>
          </div>
        ))}
      </div>
      <Divider />
      <H2>Jump to channel</H2>
      <div className="row row-wrap" style={{ gap: 6 }}>
        {data.scopes
          .filter((s) => s.id !== "all")
          .map((s) => {
            const n = [
              ...inScope(data.tasks, s.id),
              ...inScope(data.draftTargets, s.id),
            ].filter((i) => !cleared.clearedIds.includes(i.id)).length;
            return (
              <button
                key={s.id}
                type="button"
                className={scope === s.id ? "btn btn-primary" : "btn"}
                onClick={() => setScope(s.id)}
              >
                {s.short}
                {n > 0 ? ` · ${n}` : ""}
              </button>
            );
          })}
      </div>
      <Divider />
      <H2>Link health</H2>
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
      <Divider />
      <H2>Automation</H2>
      <Callout tone="info" title="Morning refresh">
        See <Code>docs/AUTOMATION.md</Code> — sessionStart hook + optional Cursor Automation. Run{" "}
        <Code>cd web && yarn dev</Code> then say &quot;Hey Jarvis, refresh&quot;.
      </Callout>
      <Text tone="quaternary" size="small">
        github.com/aliyansami/cursor-work-dashboard · MIT · No secrets in repo
      </Text>
    </Stack>
  );
}
