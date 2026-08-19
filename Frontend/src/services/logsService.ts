import { httpClient } from "./httpClient";
import type { ActivityLogDto, ErrorLogDto, RequestLogDto } from "./apiTypes";

export async function fetchActivityLogs(): Promise<ActivityLogDto[]> {
  return httpClient.get<ActivityLogDto[]>("/logs/activity");
}

export async function fetchRequestLogs(): Promise<RequestLogDto[]> {
  return httpClient.get<RequestLogDto[]>("/logs/requests");
}

export async function fetchErrorLogs(): Promise<ErrorLogDto[]> {
  return httpClient.get<ErrorLogDto[]>("/logs/errors");
}
