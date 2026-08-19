import { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import ErrorLogsTable from "../../components/logs/ErrorLogsTable";
import ErrorLogDetailModal from "../../components/logs/ErrorLogDetailModal";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import Pagination from "../../components/common/Pagination";
import { useLogs } from "../../hooks/useLogs";
import { usePagination } from "../../hooks/usePagination";
import { fetchErrorLogs } from "../../services/logsService";
import type { ErrorLogDto } from "../../services/apiTypes";

export default function ErrorLogs() {
  const { logs, isLoading, error, refetch } = useLogs(fetchErrorLogs);
  const [selectedLog, setSelectedLog] = useState<ErrorLogDto | null>(null);
  const pagination = usePagination(logs);

  return (
    <AppLayout title="Error Logs" subtitle="Every API error, expected or unexpected, raised by the backend">
      <div className="mt-1">
        {isLoading ? (
          <LoadingState label="Loading error logs..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <>
            <ErrorLogsTable logs={pagination.pageItems} onViewDetails={setSelectedLog} />
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

      <ErrorLogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </AppLayout>
  );
}
