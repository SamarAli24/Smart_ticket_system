import { useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import TicketListHeader from "../components/tickets/TicketListHeader";
import TicketFiltersBar from "../components/tickets/TicketFiltersBar";
import TicketsTable from "../components/tickets/TicketsTable";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useTickets } from "../hooks/useTickets";
import { ApiError } from "../services/httpClient";
import type { Priority, Status } from "../types";

const STATUS_CYCLE: Status[] = ["Open", "In Progress", "Resolved", "Closed"];

export default function Tickets() {
  const { tickets, isLoading, error, refetch, changeStatus, remove } = useTickets();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const assigneeOptions = useMemo(() => {
    const map = new Map<string, string>();
    tickets.forEach((t) => t.assignedTo && map.set(t.assignedTo.id, t.assignedTo.name));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [tickets]);

  const filteredTickets = tickets.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "All" && t.status !== statusFilter) return false;
    if (priorityFilter !== "All" && t.priority !== priorityFilter) return false;
    if (assigneeFilter === "Unassigned" && t.assignedTo) return false;
    if (assigneeFilter !== "All" && assigneeFilter !== "Unassigned" && t.assignedTo?.id !== assigneeFilter)
      return false;
    return true;
  });

  const handleChangeStatus = (id: string, currentStatus: Status) => {
    const nextStatus = STATUS_CYCLE[(STATUS_CYCLE.indexOf(currentStatus) + 1) % STATUS_CYCLE.length];
    changeStatus(id, nextStatus).catch(() => window.alert("Could not update ticket status."));
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await remove(deleteTargetId);
      setDeleteTargetId(null);
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : "Could not delete ticket.");
      refetch();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppLayout title="All Tickets" subtitle="Manage and resolve IT support tickets">
      <TicketListHeader count={filteredTickets.length} />

      <div className="mt-5">
        <TicketFiltersBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          assigneeFilter={assigneeFilter}
          onAssigneeFilterChange={setAssigneeFilter}
          assigneeOptions={assigneeOptions}
        />
      </div>

      <div className="mt-5">
        {isLoading ? (
          <LoadingState label="Loading tickets..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <TicketsTable
            tickets={filteredTickets}
            onChangeStatus={handleChangeStatus}
            onDelete={handleDelete}
          />
        )}
      </div>

      <ConfirmDialog
        open={deleteTargetId !== null}
        title="Delete this ticket?"
        description="This action cannot be undone. The ticket will be permanently removed from the list."
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </AppLayout>
  );
}
