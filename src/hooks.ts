import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { normalizeError } from "./api/client";
import type { ApiError, Query } from "./api/types";
export function useResource<T>(
  load: () => Promise<T>,
  key: string,
  identity = key,
) {
  const [result, setResult] = useState<{ identity: string; value: T }>();
  const [error, setError] = useState<ApiError>();
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const latest = useRef(load);
  latest.current = load;
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(undefined);
    latest
      .current()
      .then((result) => {
        if (active) setResult({ identity, value: result });
      })
      .catch((e) => {
        if (active) setError(normalizeError(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [key, identity, version]);
  return {
    data: result?.identity === identity ? result.value : undefined,
    error,
    loading,
    reload: () => setVersion((v) => v + 1),
  };
}
export function useQuery() {
  const [params, set] = useSearchParams();
  const query: Query = Object.fromEntries(params);
  return {
    query,
    key: params.toString(),
    set: (name: string, value: string) =>
      set(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (value) next.set(name, value);
          else next.delete(name);
          if (name !== "page") next.delete("page");
          return next;
        },
        { replace: true },
      ),
    clear: () => set({}),
    page: Number(params.get("page") || 1),
  };
}
export const date = (value: string | null | undefined) =>
  value
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "—";
export const number = (value: number) =>
  new Intl.NumberFormat("en").format(value);
export const label = (value: string) =>
  value.replaceAll("_", " ").replace(/^./, (c) => c.toUpperCase());
