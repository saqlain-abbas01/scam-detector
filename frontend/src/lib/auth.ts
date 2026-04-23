export interface User {
  name: string;
  email: string;
}

const STORAGE_KEY = "scam_detector_user";

export function getUser(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
}

export function login(email: string, _password: string): User {
  const name =
    email
      .split("@")[0]
      .replace(/[^a-zA-Z0-9]/g, " ")
      .trim() || "User";
  const user: User = { name, email };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function signup(name: string, email: string, _password: string): User {
  const user: User = { name, email };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}
