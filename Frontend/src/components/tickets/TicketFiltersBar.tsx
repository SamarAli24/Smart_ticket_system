import { Search } from "lucide-react";
import Select from "../common/Select";
import type { Priority, Status } from "../../types";

interface AssigneeOption {
  id: string;
  name: string;
}

interface TicketFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: Status | "All";
  onStatusFilterChange: (value: Status | "All") => void;
  priorityFilter: Priority | "All";
  onPriorityFilterChange: (value: Priority | "All") => void;
  assigneeFilter: string;
  onAssigneeFilterChange: (value: string) => void;
  assigneeOptions: AssigneeOption[];
}

export default function TicketFiltersBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  assigneeFilter,
  onAssigneeFilterChange,
  assigneeOptions,
}: TicketFiltersBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>
      <Select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as Status | "All")}
        className="w-44"
      >
        <option value="All">All statuses</option>
        <option>Open</option>
        <option>In Progress</option>
        <option>Resolved</option>
        <option>Closed</option>
      </Select>
      <Select
        value={priorityFilter}
        onChange={(e) => onPriorityFilterChange(e.target.value as Priority | "All")}
        className="w-44"
      >
        <option value="All">All priorities</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </Select>
      <Select
        value={assigneeFilter}
        onChange={(e) => onAssigneeFilterChange(e.target.value)}
        className="w-44"
      >
        <option value="All">All assignees</option>
        <option value="Unassigned">Unassigned</option>
        {assigneeOptions.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
