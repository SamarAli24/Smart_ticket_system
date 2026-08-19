import AppLayout from "../../components/layout/AppLayout";
import ActivityLogsTable from "../../components/logs/ActivityLogsTable";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import Pagination from "../../components/common/Pagination";
import { useLogs } from "../../hooks/useLogs";
import { usePagination } from "../../hooks/usePagination";
import { fetchActivityLogs } from "../../services/logsService";

export default function ActivityLogs() {
  const { logs, isLoading, error, refetch } = useLogs(fetchActivityLogs);
  const pagination = usePagination(logs);

  return (
    <AppLayout title="Activity Logs" subtitle="Every create, update, and delete action performed in the system">
      <div className="mt-1">
        {isLoading ? (
          <LoadingState label="Loading activity logs..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <>
            <ActivityLogsTable logs={pagination.pageItems} />
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
    </AppLayout>
  );
}
