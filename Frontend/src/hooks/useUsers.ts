import { useCallback, useEffect, useState } from "react";
import * as usersService from "../services/usersService";
import type { AgentUser, Role } from "../types";

export function useUsers() {
  const [users, setUsers] = useState<AgentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setUsers(await usersService.fetchUsers());
    } catch {
      setError("Could not load users. Is the backend API running?");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = useCallback(
    async (input: { fullName: string; email: string; password: string; role: Role }) => {
    const user = await usersService.createUser(input);
    setUsers((prev) => [...prev, user]);
    return user;
  }, []);

  const deactivate = useCallback(async (id: string) => {
    await usersService.deactivateUser(id);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "Inactive" } : u)));
  }, []);

  return { users, isLoading, error, refetch, create, deactivate };
}
