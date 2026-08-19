import AppLayout from "../../components/layout/AppLayout";
import RequestLogsTable from "../../components/logs/RequestLogsTable";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import { useLogs } from "../../hooks/useLogs";
import { fetchRequestLogs } from "../../services/logsService";

export default function RequestLogs() {
  const { logs, isLoading, error, refetch } = useLogs(fetchRequestLogs);

  return (
    <AppLayout title="Request Logs" subtitle="Every HTTP request handled by the API">
      <div className="mt-1">
        {isLoading ? (
          <LoadingState label="Loading request logs..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <RequestLogsTable logs={logs} />
        )}
      </div>
    </AppLayout>
  );
}
