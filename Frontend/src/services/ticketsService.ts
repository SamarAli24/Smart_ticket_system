import { httpClient } from "./httpClient";
import { ticketDtoToTicket, toApiStatus } from "./adapters";
import type { CreateTicketRequest, TicketDto, UpdateTicketStatusRequest } from "./apiTypes";
import type { Status, Ticket } from "../types";

export async function fetchTickets(): Promise<Ticket[]> {
  const dtos = await httpClient.get<TicketDto[]>("/tickets");
  return dtos.map(ticketDtoToTicket);
}

export async function createTicket(input: {
  title: string;
  description: string;
  assigneeId: string;
}): Promise<Ticket> {
  const body: CreateTicketRequest = {
    title: input.title,
    description: input.description,
    assignedToUserId: input.assigneeId ? Number(input.assigneeId) : null,
  };
  const dto = await httpClient.post<TicketDto>("/tickets", body);
  return ticketDtoToTicket(dto);
}

export async function updateTicketStatus(id: string, status: Status): Promise<Ticket> {
  const body: UpdateTicketStatusRequest = { status: toApiStatus(status) };
  const dto = await httpClient.patch<TicketDto>(`/tickets/${id}/status`, body);
  return ticketDtoToTicket(dto);
}

export async function deleteTicket(id: string): Promise<void> {
  await httpClient.delete<void>(`/tickets/${id}`);
}
