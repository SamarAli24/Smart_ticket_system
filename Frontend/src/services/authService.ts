import { httpClient } from "./httpClient";
import type { LoginRequest, LoginResponseData } from "./apiTypes";

export async function login(email: string, password: string): Promise<LoginResponseData> {
  const body: LoginRequest = { email, password };
  return httpClient.post<LoginResponseData>("/auth/login", body);
}

export async function logout(): Promise<void> {
  await httpClient.post<void>("/auth/logout");
}
