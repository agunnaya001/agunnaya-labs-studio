import AsyncStorage from "@react-native-async-storage/async-storage";

export const BASE_URL = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : "http://localhost:8080";

export const API_URL = `${BASE_URL}/api`;

const SESSION_KEY = "agunnaya_session_cookie";

export async function saveSession(cookieHeader: string) {
  await AsyncStorage.setItem(SESSION_KEY, cookieHeader);
}

export async function getSession(): Promise<string | null> {
  return AsyncStorage.getItem(SESSION_KEY);
}

export async function clearSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function fetchWithAuth(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const sessionCookie = await getSession();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (sessionCookie) {
    headers["Cookie"] = sessionCookie;
  }
  return fetch(`${API_URL}${path}`, { ...options, headers });
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
}
