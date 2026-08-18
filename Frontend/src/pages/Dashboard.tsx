import AppLayout from "../components/layout/AppLayout";
import StatCardsRow from "../components/dashboard/StatCardsRow";
import RecentTicketsCard from "../components/dashboard/RecentTicketsCard";
import CreateTicketCtaCard from "../components/dashboard/CreateTicketCtaCard";
import QueueHealthCard from "../components/dashboard/QueueHealthCard";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import { useTickets } from "../hooks/useTickets";
import { useUsers } from "../hooks/useUsers";

export default function Dashboard() {
  const { tickets, isLoading: ticketsLoading, error: ticketsError, refetch: refetchTickets } = useTickets();
  const { users, isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useUsers();

  const isLoading = ticketsLoading || usersLoading;
  const error = ticketsError ?? usersError;

  return (
    <AppLayout title="Dashboard Overview" subtitle="Manage and resolve IT support tickets">
      {isLoading ? (
        <LoadingState label="Loading dashboard..." />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => {
            refetchTickets();
            refetchUsers();
          }}
        />
      ) : (
        <>
          <StatCardsRow tickets={tickets} users={users} />

          <div className="mt-6 grid grid-cols-3 gap-5">
            <RecentTicketsCard tickets={tickets} />

            <div className="flex flex-col gap-5">
              <CreateTicketCtaCard />
              <QueueHealthCard tickets={tickets} />
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
