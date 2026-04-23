import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  type User,
  getUser,
  login as loginFn,
  signup as signupFn,
  logout as logoutFn,
} from "./auth";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => User;
  signup: (name: string, email: string, password: string) => User;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getUser);

  const login = useCallback((email: string, password: string) => {
    const u = loginFn(email, password);
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(
    (name: string, email: string, password: string) => {
      const u = signupFn(name, email, password);
      setUser(u);
      return u;
    },
    [],
  );

  const logout = useCallback(() => {
    logoutFn();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
