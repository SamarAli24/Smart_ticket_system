import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import UserListHeader from "../components/users/UserListHeader";
import UsersTable from "../components/users/UsersTable";
import AddUserModal, { NewUserInput } from "../components/users/AddUserModal";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";
import { useUsers } from "../hooks/useUsers";
import { usePagination } from "../hooks/usePagination";
import { ApiError } from "../services/httpClient";

export default function Users() {
  const { users, isLoading, error, refetch, create, deactivate } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deactivateTargetId, setDeactivateTargetId] = useState<string | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const pagination = usePagination(users);

  const handleAddUser = async (input: NewUserInput) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await create(input);
      setIsModalOpen(false);
    } catch {
      setFormError("Could not add user. Please check the details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = (id: string) => {
    setDeactivateTargetId(id);
  };

  const handleConfirmDeactivate = async () => {
    if (!deactivateTargetId) return;
    setIsDeactivating(true);
    try {
      await deactivate(deactivateTargetId);
      setDeactivateTargetId(null);
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : "Could not deactivate user.");
      refetch();
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <AppLayout title="User Management" subtitle="Manage and resolve IT support tickets">
      <UserListHeader onAddUser={() => setIsModalOpen(true)} />

      <div className="mt-5">
        {isLoading ? (
          <LoadingState label="Loading users..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <>
            <UsersTable users={pagination.pageItems} onDeactivate={handleDeactivate} />
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              totalItems={pagination.totalItems}
              rangeStart={pagination.rangeStart}
              rangeEnd={pagination.rangeEnd}
              onPageChange={pagination.setPage}
              onPageSizeChange={pagination.setPageSize}
            />
          </>
        )}
      </div>

      <AddUserModal
        open={isModalOpen}
        isSubmitting={isSubmitting}
        error={formError}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddUser}
      />

      <ConfirmDialog
        open={deactivateTargetId !== null}
        title="Deactivate this user?"
        description="They will no longer be able to sign in or be assigned new tickets."
        confirmLabel="Deactivate"
        isLoading={isDeactivating}
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setDeactivateTargetId(null)}
      />
    </AppLayout>
  );
}
