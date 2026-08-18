export type Priority = "Low" | "Medium" | "High";
export type Status = "Open" | "In Progress" | "Resolved" | "Closed";
export type Role = "Admin" | "Agent";

export interface AgentUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "Active" | "Inactive";
}

export interface Ticket {
  id: string;
  code: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignedTo: AgentUser | null;
  createdAt: string;
  createdTime: string;
}
