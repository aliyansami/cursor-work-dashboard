import type { DashboardData, Scope, ScopeId } from "../types";

export async function loadDashboard(): Promise<DashboardData> {
  const res = await fetch(`/data/dashboard.json?t=${Date.now()}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to load dashboard.json (${res.status})`);
  }
  return (await res.json()) as DashboardData;
}

export function inScope<T extends { scope: ScopeId }>(
  items: T[],
  scope: ScopeId,
): T[] {
  if (scope === "all") return items;
  return items.filter((i) => i.scope === scope);
}

export function scopeMeta(scopes: Scope[], id: ScopeId): Scope {
  return scopes.find((s) => s.id === id) ?? scopes[0]!;
}

export function actionCount(
  data: DashboardData,
  scope: ScopeId,
  clearedIds: string[],
): number {
  const open = (items: { id: string; scope: ScopeId }[]) =>
    inScope(items, scope).filter((i) => !clearedIds.includes(i.id)).length;
  return open(data.tasks) + open(data.draftTargets);
}
