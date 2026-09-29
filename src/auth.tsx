import {
  createContext,
  useContext,
  useSyncExternalStore,
  useState,
  type ReactNode,
} from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { session } from "./api/client";
import { authApi } from "./api/auth";
const AuthContext = createContext({
  authenticated: false,
  username: "Administrator",
  login: async (_u: string, _p: string) => {},
  logout: () => {},
});
export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useSyncExternalStore(session.subscribe, session.get);
  const [username, setUsername] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const saved = window.localStorage.getItem("mailflow_auth_user_v1");
        if (saved) return saved;
      } catch {
        // ignore
      }
    }
    return "Administrator";
  });

  return (
    <AuthContext.Provider
      value={{
        authenticated: !!token,
        username,
        login: async (u, p) => {
          await authApi.login(u, p);
          setUsername(u);
          try {
            if (typeof window !== "undefined" && window.localStorage) {
              window.localStorage.setItem("mailflow_auth_user_v1", u);
            }
          } catch {
            // ignore
          }
        },
        logout: authApi.logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
export function ProtectedRoute() {
  const { authenticated } = useAuth();
  const location = useLocation();
  return authenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: location.pathname + location.search }}
    />
  );
}
