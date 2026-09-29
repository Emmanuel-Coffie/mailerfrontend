import { client } from "./client";
import { resource } from "./resources";
import type {
  Campaign,
  PrepareResult,
  CampaignAnalytics,
  CampaignRecipient,
  PaginatedResponse,
  Query,
} from "./types";
export const campaignsApi = {
  ...resource<Campaign>("campaigns"),
  prepare: async (id: number) =>
    (await client.post<PrepareResult>(`/api/email/campaigns/${id}/prepare/`))
      .data,
  test: async (id: number, email: string) =>
    (
      await client.post<{ id: string }>(`/api/email/campaigns/${id}/test/`, {
        email,
      })
    ).data,
  send: async (id: number) =>
    (
      await client.post<{
        campaign_id: number;
        status: string;
        recipients: number;
      }>(`/api/email/campaigns/${id}/send/`)
    ).data,
  schedule: async (id: number, scheduled_at: string) =>
    (
      await client.post<Campaign>(`/api/email/campaigns/${id}/schedule/`, {
        scheduled_at,
      })
    ).data,
  cancel: async (id: number) =>
    (await client.post<Campaign>(`/api/email/campaigns/${id}/cancel/`)).data,
  analytics: async (id: number | string) =>
    (
      await client.get<CampaignAnalytics>(
        `/api/email/campaigns/${id}/analytics/`,
      )
    ).data,
  recipients: async (id: number | string, params: Query = {}) =>
    (
      await client.get<PaginatedResponse<CampaignRecipient>>(
        `/api/email/campaigns/${id}/recipients/`,
        { params },
      )
    ).data,
};
