import { afterEach, expect, it, vi } from "vitest";
import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { client, publicClient, session } from "../api/client";
const response = (
  config: InternalAxiosRequestConfig,
  data: unknown,
  status = 200,
): AxiosResponse => ({
  config,
  data,
  status,
  statusText: "OK",
  headers: new AxiosHeaders(),
});
const original = client.defaults.adapter;
afterEach(() => {
  client.defaults.adapter = original;
  session.clear();
  vi.restoreAllMocks();
});
it("refreshes once for concurrent expired requests and retries them", async () => {
  session.set({ access: "expired", refresh: "refresh" });
  const refresh = vi
    .spyOn(publicClient, "post")
    .mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 10));
      return { data: { access: "fresh" } };
    });
  client.defaults.adapter = async (config) => {
    if (config.headers.Authorization === "Bearer expired")
      throw new AxiosError(
        "Expired",
        undefined,
        config,
        undefined,
        response(config, { detail: "expired" }, 401),
      );
    return response(config, { ok: true });
  };
  const result = await Promise.all([client.get("/one"), client.get("/two")]);
  expect(refresh).toHaveBeenCalledOnce();
  expect(result.every((r) => r.data.ok)).toBe(true);
  expect(session.get()).toBe("fresh");
});
it("clears the session when refresh fails", async () => {
  session.set({ access: "expired", refresh: "refresh" });
  vi.spyOn(publicClient, "post").mockRejectedValue(
    new Error("Expired refresh"),
  );
  client.defaults.adapter = async (config) => {
    throw new AxiosError(
      "Expired",
      undefined,
      config,
      undefined,
      response(config, {}, 401),
    );
  };
  await expect(client.get("/one")).rejects.toThrow();
  expect(session.get()).toBe("");
});
it("does not retry validation errors or send mutations automatically", async () => {
  const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => {
    throw new AxiosError(
      "Invalid",
      undefined,
      config,
      undefined,
      response(config, { email: ["Invalid"] }, 400),
    );
  });
  client.defaults.adapter = adapter;
  await expect(client.post("/send")).rejects.toThrow();
  expect(adapter).toHaveBeenCalledOnce();
});
