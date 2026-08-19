import { useCallback, useEffect, useState } from "react";

export function useLogs<T>(fetcher: () => Promise<T[]>) {
  const [logs, setLogs] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setLogs(await fetcher());
    } catch {
      setError("Could not load logs. Is the backend API running?");
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { logs, isLoading, error, refetch };
}
