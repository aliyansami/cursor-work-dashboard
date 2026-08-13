import type { FeedItem, PriorityItem, WorkItem, WrapItem } from "../types";
import { useDashboard } from "../context";
import { ClearToggle } from "./ClearToggle";
import { ExtLink, H3, Pill, Row, Spacer, Stack, Text } from "./ui";

export function PriorityStack({ items }: { items: PriorityItem[] }) {
  const { cleared } = useDashboard();
  if (items.length === 0) return null;
  return (
    <Stack gap={0}>
      {items.map((p, i) => {
        const done = cleared.isCleared(p.id);
        return (
          <div key={p.id} className={`priority-row${done ? " cleared" : ""}`}>
            <div className="row row-start" style={{ flex: 1, minWidth: 0, gap: 12 }}>
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              {p.href ? (
                <ExtLink href={p.href}>{p.text}</ExtLink>
              ) : (
                <Text weight="medium">{p.text}</Text>
              )}
            </div>
            <ClearToggle id={p.id} />
          </div>
        );
      })}
    </Stack>
  );
}

export function TaskCards({ items }: { items: WorkItem[] }) {
  const { cleared } = useDashboard();
  if (items.length === 0) return null;
  return (
    <Stack gap={8}>
      {items.map((t) => {
        const done = cleared.isCleared(t.id);
        return (
          <div key={t.id} className={`task-card${done ? " cleared" : ""}`}>
            <div className="row row-between row-wrap" style={{ gap: 8 }}>
              <div className="row row-wrap" style={{ gap: 6 }}>
                <Pill>{t.priority.toUpperCase()}</Pill>
                {done && <Pill active>CLEARED</Pill>}
              </div>
              <div className="row" style={{ gap: 8 }}>
                <Text tone="tertiary" size="small">
                  {t.project}
                </Text>
                <ClearToggle id={t.id} />
              </div>
            </div>
            <Spacer size={6} />
            {t.href ? (
              <ExtLink href={t.href}>{t.title}</ExtLink>
            ) : (
              <Text weight="semibold">{t.title}</Text>
            )}
            <Text tone="secondary" size="small">
              {t.detail} · {t.source}
            </Text>
          </div>
        );
      })}
    </Stack>
  );
}

export function FeedRow({ item }: { item: FeedItem }) {
  const { cleared } = useDashboard();
  const done = cleared.isCleared(item.id);
  return (
    <div className={`feed-row${done ? " cleared" : ""}`}>
      <div
        className={`rail${done ? " rail-success" : item.unread ? " rail-accent" : ""}`}
      />
      <Stack gap={3} style={{ flex: 1, minWidth: 0 }}>
        <div className="row row-between row-wrap" style={{ gap: 6 }}>
          <div className="row row-wrap" style={{ gap: 6 }}>
            {done ? (
              <Pill active>CLEARED</Pill>
            ) : (
              item.unread && <Pill active>NEW</Pill>
            )}
            {item.tag && <Pill>{item.tag}</Pill>}
            <Text tone="quaternary" size="small">
              {item.meta}
            </Text>
          </div>
          <ClearToggle id={item.id} />
        </div>
        <ExtLink href={item.href}>{item.title}</ExtLink>
        <Text tone="secondary" size="small">
          {item.preview}
        </Text>
      </Stack>
    </div>
  );
}

export function WrapList({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "closed" | "waiting";
  items: WrapItem[];
}) {
  const { cleared } = useDashboard();
  if (items.length === 0) return null;
  return (
    <Stack gap={6}>
      <Row between>
        <H3>{title}</H3>
        <Pill>{String(items.length)}</Pill>
      </Row>
      <Stack gap={0}>
        {items.map((item) => {
          const done = cleared.isCleared(item.id);
          return (
            <div key={item.id} className={`wrap-row${done ? " cleared" : ""}`}>
              <div
                className={`rail${
                  done || tone === "closed" ? " rail-success" : " rail-accent"
                }`}
              />
              <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                <div className="row row-between row-wrap" style={{ gap: 8 }}>
                  {item.href ? (
                    <ExtLink href={item.href}>{item.title}</ExtLink>
                  ) : (
                    <Text weight="medium">{item.title}</Text>
                  )}
                  {tone === "waiting" && <ClearToggle id={item.id} />}
                </div>
                <Text tone="secondary" size="small">
                  {item.detail}
                </Text>
              </Stack>
            </div>
          );
        })}
      </Stack>
    </Stack>
  );
}
