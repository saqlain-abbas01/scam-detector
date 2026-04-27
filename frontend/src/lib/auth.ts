import { apiRequest } from "./api-client";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user: {
    _id?: string;
    id?: string;
    name: string;
    email: string;
  };
}

const normalizeUser = (user: AuthResponse["user"]): User => ({
  id: user._id || user.id || "",
  name: user.name,
  email: user.email,
});

export async function login(email: string, password: string): Promise<User> {
  const response = await apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return normalizeUser(response.user);
}

export async function signup(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  const response = await apiRequest<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  return normalizeUser(response.user);
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiRequest<AuthResponse>("/api/auth/me");
    return normalizeUser(response.user);
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<{ success: boolean; message?: string }>(
      "/api/auth/logout",
      {
        method: "POST",
      },
    );
  } catch {
    // Ignore logout errors on the client and clear local auth state anyway.
  }
}
