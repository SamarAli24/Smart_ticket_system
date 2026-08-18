import type { AgentUser, Status, Ticket } from "../types";
import type { TicketDto, UserDto } from "./apiTypes";

const statusFromApi: Record<TicketDto["status"], Status> = {
  Open: "Open",
  InProgress: "In Progress",
  Resolved: "Resolved",
  Closed: "Closed",
};

const statusToApi: Record<Status, TicketDto["status"]> = {
  Open: "Open",
  "In Progress": "InProgress",
  Resolved: "Resolved",
  Closed: "Closed",
};

export function toApiStatus(status: Status): TicketDto["status"] {
  return statusToApi[status];
}

export function userDtoToAgentUser(dto: UserDto): AgentUser {
  return {
    id: String(dto.id),
    name: dto.fullName,
    email: dto.email,
    role: dto.role,
    status: dto.isActive ? "Active" : "Inactive",
  };
}

export function ticketDtoToTicket(dto: TicketDto): Ticket {
  const created = new Date(dto.createdDate);
  return {
    id: String(dto.id),
    code: `TKT-${String(dto.id).padStart(4, "0")}`,
    title: dto.title,
    description: dto.description,
    priority: dto.priority,
    status: statusFromApi[dto.status],
    assignedTo: dto.assignedToUser ? userDtoToAgentUser(dto.assignedToUser) : null,
    createdAt: created.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    createdTime: created.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
  };
}
