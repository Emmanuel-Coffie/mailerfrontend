import { client } from "./client";
import { resource } from "./resources";
import type { ContactList } from "./types";
export const listsApi = {
  ...resource<ContactList>("lists"),
  members: async (id: number, contact_ids: number[], add: boolean) =>
    (
      await client.post<ContactList>(
        `/api/email/lists/${id}/${add ? "add" : "remove"}-contacts/`,
        { contact_ids },
      )
    ).data,
};
