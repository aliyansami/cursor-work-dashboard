import type { CSSProperties, ReactNode } from "react";
import type { SourceStatus, SwatchColor } from "../types";

export function Shell({ children }: { children: ReactNode }) {
  return <div className="shell">{children}</div>;
}

export function Panel({ children }: { children: ReactNode }) {
  return <div className="panel">{children}</div>;
}

export function Stack({
  gap = 8,
  children,
  style,
}: {
  gap?: 0 | 2 | 3 | 4 | 6 | 8 | 10 | 12 | 14 | 16;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div className={`stack stack-${gap}`} style={style}>
      {children}
    </div>
  );
}

export function Row({
  children,
  wrap,
  between,
  start,
  gap,
}: {
  children: ReactNode;
  wrap?: boolean;
  between?: boolean;
  start?: boolean;
  gap?: number;
}) {
  return (
    <div
      className={[
        "row",
        wrap ? "row-wrap" : "",
        between ? "row-between" : "",
        start ? "row-start" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={gap != null ? { gap } : undefined}
    >
      {children}
    </div>
  );
}

export function H1({ children }: { children: ReactNode }) {
  return <h1 className="h1">{children}</h1>;
}
export function H2({ children }: { children: ReactNode }) {
  return <h2 className="h2">{children}</h2>;
}
export function H3({ children }: { children: ReactNode }) {
  return <h3 className="h3">{children}</h3>;
}

export function Text({
  children,
  size,
  tone,
  weight,
  style,
}: {
  children: ReactNode;
  size?: "small";
  tone?: "secondary" | "tertiary" | "quaternary";
  weight?: "medium" | "semibold" | "bold";
  style?: CSSProperties;
}) {
  return (
    <div
      className={[
        size === "small" ? "text-sm" : "",
        tone === "secondary" ? "text-secondary" : "",
        tone === "tertiary" ? "text-tertiary" : "",
        tone === "quaternary" ? "text-quaternary" : "",
        weight ? `weight-${weight}` : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {children}
    </div>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="code">{children}</code>;
}

export function Pill({
  children,
  active,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <span className={`pill${active ? " pill-active" : ""}`}>{children}</span>
  );
}

export function Button({
  children,
  onClick,
  variant = "secondary",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const cls =
    variant === "primary"
      ? "btn btn-primary"
      : variant === "ghost"
        ? "btn btn-ghost"
        : "btn";
  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

export function StatusDot({ status }: { status: SourceStatus }) {
  return <span className={`status-dot status-${status}`} />;
}

export function Swatch({ color }: { color: SwatchColor }) {
  return <span className={`swatch swatch-${color}`} />;
}

export function Callout({
  title,
  tone = "neutral",
  children,
}: {
  title: string;
  tone?: "info" | "warning" | "success" | "neutral";
  children: ReactNode;
}) {
  return (
    <div className={`callout callout-${tone}`}>
      <div className="callout-title">{title}</div>
      <div className="text-sm text-secondary">{children}</div>
    </div>
  );
}

export function Spacer({ size = 8 }: { size?: 6 | 8 | 12 }) {
  return <div className={`spacer-${size}`} />;
}

export function Divider() {
  return <hr className="divider" />;
}

export function ExtLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}
