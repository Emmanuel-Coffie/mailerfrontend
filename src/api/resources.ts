import { client } from "./client";
import type { PaginatedResponse, Query } from "./types";
export function resource<T>(name: string) {
  const path = `/api/email/${name}/`;
  return {
    list: async (params: Query = {}) =>
      (await client.get<PaginatedResponse<T>>(path, { params })).data,
    get: async (id: number | string) =>
      (await client.get<T>(`${path}${id}/`)).data,
    create: async (data: Partial<T>) => (await client.post<T>(path, data)).data,
    update: async (id: number | string, data: Partial<T>) =>
      (await client.patch<T>(`${path}${id}/`, data)).data,
    remove: async (id: number | string) => {
      await client.delete(`${path}${id}/`);
    },
    all: async () => {
      const results: T[] = [];
      let page = 1;
      while (true) {
        const { data } = await client.get<PaginatedResponse<T>>(path, {
          params: { page },
        });
        results.push(...data.results);
        if (!data.next) return results;
        page++;
      }
    },
  };
}
