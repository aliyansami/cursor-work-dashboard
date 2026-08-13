import { useCallback, useEffect, useState } from "react";
import { DashboardProvider, useDashboard } from "./context";
import { loadDashboard } from "./data/loadDashboard";
import type { DashboardData, ScopeId, ViewId } from "./types";
import { ChannelSwitcher } from "./components/ChannelSwitcher";
import { MissionHeader } from "./components/MissionHeader";
import { SignalStrip, SourceRail } from "./components/SignalStrip";
import {
  ActionsView,
  BriefView,
  InboxView,
  OpsView,
  WrapView,
} from "./components/Views";
import { Divider, Shell, Stack } from "./components/ui";
import "./styles/theme.css";

function DashboardBody() {
  const { view } = useDashboard();
  return (
    <Shell>
      <MissionHeader />
      <ChannelSwitcher />
      <Stack gap={16}>
        <SignalStrip />
        <SourceRail />
        <Divider />
        {view === "brief" && <BriefView />}
        {view === "inbox" && <InboxView />}
        {view === "wrap" && <WrapView />}
        {view === "actions" && <ActionsView />}
        {view === "ops" && <OpsView />}
      </Stack>
    </Shell>
  );
}

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewId>("brief");
  const [scope, setScope] = useState<ScopeId>("all");

  const reload = useCallback(() => {
    setError(null);
    loadDashboard()
      .then(setData)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load dashboard"),
      );
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <p className="text-sm text-tertiary">
          Expected file at <code className="code">web/public/data/dashboard.json</code>
        </p>
        <button type="button" className="btn" onClick={reload}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return <div className="loading">Loading ops console…</div>;
  }

  return (
    <DashboardProvider
      data={data}
      view={view}
      setView={setView}
      scope={scope}
      setScope={setScope}
      reload={reload}
    >
      <DashboardBody />
    </DashboardProvider>
  );
}
