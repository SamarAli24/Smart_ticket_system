import { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import ErrorLogsTable from "../../components/logs/ErrorLogsTable";
import ErrorLogDetailModal from "../../components/logs/ErrorLogDetailModal";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import { useLogs } from "../../hooks/useLogs";
import { fetchErrorLogs } from "../../services/logsService";
import type { ErrorLogDto } from "../../services/apiTypes";

export default function ErrorLogs() {
  const { logs, isLoading, error, refetch } = useLogs(fetchErrorLogs);
  const [selectedLog, setSelectedLog] = useState<ErrorLogDto | null>(null);

  return (
    <AppLayout title="Error Logs" subtitle="Every API error, expected or unexpected, raised by the backend">
      <div className="mt-1">
        {isLoading ? (
          <LoadingState label="Loading error logs..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <ErrorLogsTable logs={logs} onViewDetails={setSelectedLog} />
        )}
      </div>

      <ErrorLogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </AppLayout>
  );
}
