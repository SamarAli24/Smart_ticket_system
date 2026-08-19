import { useEffect, useMemo, useState } from "react";

export const PAGE_SIZE_OPTIONS = [5, 15, 25, 50];

/**
 * Client-side pagination over an already-loaded list. The logs endpoints return the full
 * collection in one call, so slicing here avoids any API change.
 */
export function usePagination<T>(items: T[], initialPageSize = 15) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Clamp on read rather than only in the effect below, so a shrinking list (refetch) never
  // renders an out-of-range empty page for a frame.
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  const changePageSize = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  return {
    pageItems,
    page: safePage,
    setPage,
    pageSize,
    setPageSize: changePageSize,
    totalPages,
    totalItems,
    rangeStart: totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1,
    rangeEnd: Math.min(safePage * pageSize, totalItems),
  };
}
