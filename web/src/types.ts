export type SourceStatus = "live" | "degraded" | "offline";
export type ViewId = "brief" | "inbox" | "wrap" | "actions" | "ops";
export type DraftChannel = "slack" | "gmail";
export type ScopeId = string;
export type SwatchColor =
  | "blue"
  | "orange"
  | "green"
  | "purple"
  | "red"
  | "yellow"
  | "gray";

export type Scope = {
  id: ScopeId;
  short: string;
  slack?: string;
  project: string;
  color: SwatchColor;
};

export type SourceRow = {
  name: string;
  account: string;
  status: SourceStatus;
  note: string;
  setup: string;
};

export type WorkItem = {
  id: string;
  title: string;
  project: string;
  priority: "high" | "medium" | "low";
  source: string;
  status: string;
  detail: string;
  scope: ScopeId;
  href?: string;
};

export type FeedItem = {
  id: string;
  title: string;
  preview: string;
  meta: string;
  href: string;
  scope: ScopeId;
  tag?: string;
  unread?: boolean;
};

export type WrapItem = {
  id: string;
  title: string;
  detail: string;
  scope: ScopeId;
  href?: string;
};

export type PriorityItem = {
  id: string;
  n: string;
  text: string;
  scope: ScopeId;
  href?: string;
};

export type CalItem = {
  time: string;
  title: string;
  status: string;
  scope: ScopeId;
};

export type DraftTarget = {
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

export type ProjectCard = {
  name: string;
  color: SwatchColor;
  load: number;
  note: string;
  scope: ScopeId;
};

export type DashboardData = {
  generatedAt: string;
  user: string;
  email: string;
  workspace: string;
  sources: SourceRow[];
  scopes: Scope[];
  tasks: WorkItem[];
  priorities: PriorityItem[];
  slackThreads: FeedItem[];
  emails: FeedItem[];
  calendarToday: CalItem[];
  calendarTomorrow: CalItem[];
  projects: ProjectCard[];
  closedToday: WrapItem[];
  stillWaiting: WrapItem[];
  tomorrowTop3: PriorityItem[];
  draftTargets: DraftTarget[];
};
