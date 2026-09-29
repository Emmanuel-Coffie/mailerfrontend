import { client } from "./client";
import { resource } from "./resources";
import type { Contact, ImportResult } from "./types";
export const contactsApi = {
  ...resource<Contact>("contacts"),
  import: async (file: File, list?: number) => {
    const data = new FormData();
    data.append("file", file);
    if (list) data.append("contact_list_id", String(list));
    return (
      await client.post<ImportResult>("/api/email/contacts/import/", data)
    ).data;
  },
};
