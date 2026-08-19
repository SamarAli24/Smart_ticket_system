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

export interface ActivityLogDto {
  id: number;
  action: string;
  entityName: string;
  entityId: number;
  performedByUserId: number | null;
  details: string | null;
  timestamp: string;
}

export interface RequestLogDto {
  id: number;
  method: string;
  path: string;
  queryString: string | null;
  statusCode: number;
  responseTimeMs: number;
  ipAddress: string | null;
  userId: number | null;
  timestamp: string;
}

export interface ErrorLogDto {
  id: number;
  method: string;
  path: string;
  statusCode: number;
  errorCode: number | null;
  message: string;
  exceptionType: string | null;
  stackTrace: string | null;
  userId: number | null;
  ipAddress: string | null;
  timestamp: string;
}
