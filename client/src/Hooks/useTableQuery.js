import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const useTableQuery = ({ sort = "created_at", order = "desc", limit = 10, filters = [] } = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = useMemo(() => {
    const values = {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || limit,
      search: searchParams.get("search") || "",
      sort: searchParams.get("sort") || sort,
      order: searchParams.get("order") || order,
    };

    filters.forEach((name) => {
      values[name] = searchParams.get(name) || "";
    });

    return values;
  }, [searchParams, sort, order, limit, filters.join(",")]);

  const update = useCallback(
    (changes, resetPage = true) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);

          Object.entries(changes).forEach(([key, value]) => {
            if (value === "" || value === null || value === undefined) {
              next.delete(key);
            } else {
              next.set(key, value);
            }
          });

          if (resetPage) {
            next.delete("page");
          }

          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setPage = useCallback((page) => update({ page: page > 1 ? page : "" }, false), [update]);
  const setLimit = useCallback((value) => update({ limit: value }), [update]);
  const setSearch = useCallback((value) => update({ search: value }), [update]);
  const setFilter = useCallback((name, value) => update({ [name]: value }), [update]);
  const setSort = useCallback(
    (field) => {
      const nextOrder = query.sort === field && query.order === "asc" ? "desc" : "asc";
      update({ sort: field, order: nextOrder });
    },
    [query.sort, query.order, update],
  );
  const setSortOrder = useCallback((field, direction) => update({ sort: field, order: direction }), [update]);
  const resetFilters = useCallback(
    () => update(Object.fromEntries(["search", ...filters].map((name) => [name, ""]))),
    [update, filters.join(",")],
  );

  return { query, setPage, setLimit, setSearch, setFilter, setSort, setSortOrder, resetFilters };
};
