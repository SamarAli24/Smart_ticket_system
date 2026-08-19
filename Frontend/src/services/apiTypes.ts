export interface UserDto {
  id: number;
  fullName: string;
  email: string;
  role: "Admin" | "Agent";
  isActive: boolean;
}

export interface TicketDto {
  id: number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "InProgress" | "Resolved" | "Closed";
  createdDate: string;
  assignedToUserId: number | null;
  assignedToUser: UserDto | null;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  assignedToUserId: number | null;
}

export interface UpdateTicketRequest {
  title: string;
  description: string;
  assignedToUserId: number | null;
}

export interface UpdateTicketStatusRequest {
  status: TicketDto["status"];
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: "Admin" | "Agent";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  expiresAtUtc: string;
  user: UserDto;
}
