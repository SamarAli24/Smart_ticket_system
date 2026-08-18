import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import TicketForm from "../components/tickets/TicketForm";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import { useTickets } from "../hooks/useTickets";
import { useUsers } from "../hooks/useUsers";

export default function CreateTicket() {
  const navigate = useNavigate();
  const { users, isLoading, error, refetch } = useUsers();
  const { create } = useTickets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: { title: string; description: string; assigneeId: string }) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await create(data);
      navigate("/tickets");
    } catch {
      setSubmitError("Could not create ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Create Ticket" subtitle="Manage and resolve IT support tickets">
      <Link
        to="/tickets"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="mx-auto mt-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-slate-900">Create a support ticket</h2>
        <p className="mt-1 text-sm text-slate-500">
          Provide a clear title and a detailed description. Our triage system handles priority
          assignment automatically.
        </p>

        <div className="mt-5">
          {isLoading ? (
            <LoadingState label="Loading agents..." />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : (
            <>
              {submitError && (
                <p className="mb-4 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {submitError}
                </p>
              )}
              <TicketForm users={users} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
