import { publicClient, client, session } from "./client";
export const authApi = {
  login: async (username: string, password: string) => {
    const { data } = await publicClient.post<{
      access: string;
      refresh: string;
    }>("/api/auth/token/", { username, password });
    session.set(data);
    try {
      await client.get("/api/email/dashboard/");
    } catch (error) {
      session.clear();
      throw error;
    }
  },
  logout: session.clear,
};
