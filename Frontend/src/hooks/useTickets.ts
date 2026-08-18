import { useCallback, useEffect, useState } from "react";
import * as ticketsService from "../services/ticketsService";
import type { Status, Ticket } from "../types";

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setTickets(await ticketsService.fetchTickets());
    } catch {
      setError("Could not load tickets. Is the backend API running?");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = useCallback(
    async (input: { title: string; description: string; assigneeId: string }) => {
      const ticket = await ticketsService.createTicket(input);
      setTickets((prev) => [ticket, ...prev]);
      return ticket;
    },
    []
  );

  const changeStatus = useCallback(async (id: string, status: Status) => {
    const updated = await ticketsService.updateTicketStatus(id, status);
    setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const remove = useCallback(async (id: string) => {
    await ticketsService.deleteTicket(id);
    setTickets((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tickets, isLoading, error, refetch, create, changeStatus, remove };
}
