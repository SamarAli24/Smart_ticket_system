import AppLayout from "../../components/layout/AppLayout";
import ActivityLogsTable from "../../components/logs/ActivityLogsTable";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import { useLogs } from "../../hooks/useLogs";
import { fetchActivityLogs } from "../../services/logsService";

export default function ActivityLogs() {
  const { logs, isLoading, error, refetch } = useLogs(fetchActivityLogs);

  return (
    <AppLayout title="Activity Logs" subtitle="Every create, update, and delete action performed in the system">
      <div className="mt-1">
        {isLoading ? (
          <LoadingState label="Loading activity logs..." />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <ActivityLogsTable logs={logs} />
        )}
      </div>
    </AppLayout>
  );
}
