import { client, publicClient } from "./client";
import type { ProviderStatus } from "./types";
export const settingsApi = {
  get: async () =>
    (await client.get<ProviderStatus>("/api/email/settings/status/")).data,
};
export const unsubscribeApi = {
  get: async (token: string) =>
    (
      await publicClient.get<{ detail: string }>(
        `/api/email/unsubscribe/${encodeURIComponent(token)}/`,
      )
    ).data,
};
