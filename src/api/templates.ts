import { client } from "./client";
import { resource } from "./resources";
import type { EmailTemplate, Preview } from "./types";
export const templatesApi = {
  ...resource<EmailTemplate>("templates"),
  preview: async (id: number, data: Record<string, string>) =>
    (await client.post<Preview>(`/api/email/templates/${id}/preview/`, data))
      .data,
};
