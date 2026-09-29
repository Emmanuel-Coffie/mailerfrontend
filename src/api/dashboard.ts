import { client } from "./client";
import type { DashboardMetrics } from "./types";
export const dashboardApi = {
  get: async () =>
    (await client.get<DashboardMetrics>("/api/email/dashboard/")).data,
};
