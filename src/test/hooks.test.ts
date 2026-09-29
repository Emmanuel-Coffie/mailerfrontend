import { act, renderHook, waitFor } from "@testing-library/react";
import { expect, it } from "vitest";
import { useResource } from "../hooks";

it("never shows a previous record after navigating to a different identity", async () => {
  let resolveNext!: (value: string) => void;
  const next = new Promise<string>((resolve) => {
    resolveNext = resolve;
  });
  const { result, rerender } = renderHook(
    ({ id }) =>
      useResource(() => (id === "one" ? Promise.resolve("first") : next), id),
    { initialProps: { id: "one" } },
  );
  await waitFor(() => expect(result.current.data).toBe("first"));
  rerender({ id: "two" });
  expect(result.current.data).toBeUndefined();
  await act(async () => resolveNext("second"));
  expect(result.current.data).toBe("second");
});

it("retains a record during polling and ignores a late response after navigation", async () => {
  let resolveOld!: (value: string) => void;
  const old = new Promise<string>((resolve) => {
    resolveOld = resolve;
  });
  const { result, rerender } = renderHook(
    ({ id, tick }) =>
      useResource(
        () =>
          id === "two"
            ? Promise.resolve("second")
            : tick
              ? old
              : Promise.resolve("first"),
        `${id}:${tick}`,
        id,
      ),
    { initialProps: { id: "one", tick: 0 } },
  );
  await waitFor(() => expect(result.current.data).toBe("first"));
  rerender({ id: "one", tick: 1 });
  expect(result.current.data).toBe("first");
  rerender({ id: "two", tick: 0 });
  await waitFor(() => expect(result.current.data).toBe("second"));
  await act(async () => resolveOld("outdated"));
  expect(result.current.data).toBe("second");
});
