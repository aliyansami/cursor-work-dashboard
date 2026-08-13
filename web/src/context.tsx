import { createContext, useContext, type ReactNode } from "react";
import type { DashboardData, ScopeId, ViewId } from "./types";
import { useCleared } from "./hooks/useCleared";

type ClearedApi = ReturnType<typeof useCleared>;

type DashboardContextValue = {
  data: DashboardData;
  view: ViewId;
  setView: (v: ViewId) => void;
  scope: ScopeId;
  setScope: (s: ScopeId) => void;
  reload: () => void;
  cleared: ClearedApi;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({
  data,
  view,
  setView,
  scope,
  setScope,
  reload,
  children,
}: {
  data: DashboardData;
  view: ViewId;
  setView: (v: ViewId) => void;
  scope: ScopeId;
  setScope: (s: ScopeId) => void;
  reload: () => void;
  children: ReactNode;
}) {
  const cleared = useCleared();
  return (
    <DashboardContext.Provider
      value={{ data, view, setView, scope, setScope, reload, cleared }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard requires DashboardProvider");
  return ctx;
}
