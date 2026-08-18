import { httpClient } from "./httpClient";
import { userDtoToAgentUser } from "./adapters";
import type { CreateUserRequest, UserDto } from "./apiTypes";
import type { AgentUser, Role } from "../types";

export async function fetchUsers(): Promise<AgentUser[]> {
  const dtos = await httpClient.get<UserDto[]>("/users");
  return dtos.map(userDtoToAgentUser);
}

export async function createUser(input: {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}): Promise<AgentUser> {
  const body: CreateUserRequest = {
    fullName: input.fullName,
    email: input.email,
    password: input.password,
    role: input.role,
  };
  const dto = await httpClient.post<UserDto>("/users", body);
  return userDtoToAgentUser(dto);
}

export async function deactivateUser(id: string): Promise<void> {
  await httpClient.patch<void>(`/users/${id}/deactivate`);
}
