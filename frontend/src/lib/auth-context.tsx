import { createContext, useContext, type ReactNode, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type User,
  getCurrentUser,
  login as loginFn,
  signup as signupFn,
  logout as logoutFn,
} from "./auth";

interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginFn(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => signupFn(name, email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "me"], user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutFn,
    onSettled: () => {
      queryClient.setQueryData(["auth", "me"], null);
    },
  });

  const value = useMemo<AuthContextType>(
    () => ({
      user: meQuery.data || null,
      isAuthLoading:
        meQuery.isLoading ||
        loginMutation.isPending ||
        signupMutation.isPending ||
        logoutMutation.isPending,
      login: async (email: string, password: string) => {
        return loginMutation.mutateAsync({ email, password });
      },
      signup: async (name: string, email: string, password: string) => {
        return signupMutation.mutateAsync({ name, email, password });
      },
      logout: async () => {
        await logoutMutation.mutateAsync();
      },
    }),
    [
      meQuery.data,
      meQuery.isLoading,
      loginMutation,
      signupMutation,
      logoutMutation,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
