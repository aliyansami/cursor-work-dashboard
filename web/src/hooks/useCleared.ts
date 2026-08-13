import { useCallback, useMemo, useState } from "react";

const CLEARED_KEY = "jarvis-cleared-ids";
const SHOW_KEY = "jarvis-show-cleared";

function readIds(): string[] {
  try {
    const raw = localStorage.getItem(CLEARED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function readShow(): boolean {
  try {
    return localStorage.getItem(SHOW_KEY) === "1";
  } catch {
    return false;
  }
}

export function useCleared() {
  const [clearedIds, setClearedIds] = useState<string[]>(() => readIds());
  const [showCleared, setShowClearedState] = useState(() => readShow());

  const persist = useCallback((ids: string[]) => {
    setClearedIds(ids);
    localStorage.setItem(CLEARED_KEY, JSON.stringify(ids));
  }, []);

  const setShowCleared = useCallback((v: boolean) => {
    setShowClearedState(v);
    localStorage.setItem(SHOW_KEY, v ? "1" : "0");
  }, []);

  const isCleared = useCallback(
    (id: string) => clearedIds.includes(id),
    [clearedIds],
  );

  const clear = useCallback(
    (id: string) => {
      persist(clearedIds.includes(id) ? clearedIds : [...clearedIds, id]);
    },
    [clearedIds, persist],
  );

  const restore = useCallback(
    (id: string) => {
      persist(clearedIds.filter((x) => x !== id));
    },
    [clearedIds, persist],
  );

  const restoreAll = useCallback(() => persist([]), [persist]);

  const visible = useCallback(
    <T extends { id: string }>(items: T[]) =>
      showCleared ? items : items.filter((i) => !clearedIds.includes(i.id)),
    [clearedIds, showCleared],
  );

  return useMemo(
    () => ({
      clearedIds,
      showCleared,
      setShowCleared,
      isCleared,
      clear,
      restore,
      restoreAll,
      visible,
    }),
    [
      clearedIds,
      showCleared,
      setShowCleared,
      isCleared,
      clear,
      restore,
      restoreAll,
      visible,
    ],
  );
}
