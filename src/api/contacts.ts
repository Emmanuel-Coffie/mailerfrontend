import { client } from "./client";
import { resource } from "./resources";
import type { Contact, ImportResult } from "./types";
export const contactsApi = {
  ...resource<Contact>("contacts"),
  import: async (
    file: File,
    list?: number,
    groupBy = "auto",
    preview = false,
  ) => {
    const data = new FormData();
    data.append("file", file);
    data.append("group_by", groupBy);
    data.append("preview", String(preview));
    if (list) data.append("contact_list_id", String(list));
    return (
      await client.post<ImportResult>("/api/email/contacts/import/", data)
    ).data;
  },
};
