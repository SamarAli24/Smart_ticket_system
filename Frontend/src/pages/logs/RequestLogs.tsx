import AppLayout from "../../components/layout/AppLayout";
import RequestLogsTable from "../../components/logs/RequestLogsTable";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import Pagination from "../../components/common/Pagination";
import { useLogs } from "../../hooks/useLogs";
import { usePagination } from "../../hooks/usePagination";
import { fetchRequestLogs } from "../../services/logsService";

export default function RequestLogs() {
  const { logs, isLoading, error, refetch } = useLogs(fetchRequestLogs);
  const pagination = usePagination(logs);

  return (
    <AppLayout title="Request Logs" subtitle="Every HTTP request handled by the API">
      <div className="mt-1">
        {isLoading ? (
          <LoadingState label="Loading request logs..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <>
            <RequestLogsTable logs={pagination.pageItems} />
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
