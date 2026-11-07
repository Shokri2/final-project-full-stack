import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../Components/Common/PageHeader";
import DataTable from "../../Components/Common/DataTable";
import FilterSelect from "../../Components/Common/FilterSelect";
import RequestFilters from "../../Components/Requests/RequestFilters";
import {
  agronomistColumn,
  createdColumn,
  farmerColumn,
  priorityColumn,
  statusColumn,
  titleColumn,
  updatedColumn,
} from "../../Components/Requests/requestColumns";
import { useFetch } from "../../Hooks/useFetch";
import { useTableQuery } from "../../Hooks/useTableQuery";
import { getRequests } from "../../api/requestsApi";
import { getUsers } from "../../api/usersApi";

const columns = [titleColumn, farmerColumn, statusColumn, priorityColumn, agronomistColumn, createdColumn, updatedColumn];

function AdminRequests() {
  const navigate = useNavigate();
  const table = useTableQuery({ filters: ["status", "priority", "agronomist_id"] });
  const { query } = table;
  const fetchRequests = useCallback(() => getRequests(query), [query]);
  const { data, loading, error, refetch } = useFetch(fetchRequests, [fetchRequests]);
  const agronomists = useFetch(() => getUsers({ role: "agronomist", limit: 100, sort: "name", order: "asc" }), []);

  const agronomistOptions = useMemo(
    () => (agronomists.data?.users ?? []).map((user) => ({ value: String(user.id), label: user.name })),
    [agronomists.data],
  );

  return (
    <>
      <PageHeader title="Consultation requests" subtitle="Assign, follow and close every farmer request." />

      <RequestFilters {...table} placeholder="Search by title, crop or farmer...">
        <FilterSelect
          label="Agronomist"
          value={query.agronomist_id}
          onChange={(value) => table.setFilter("agronomist_id", value)}
          options={agronomistOptions}
          allLabel="Anyone"
          minWidth={170}
        />
      </RequestFilters>

      <DataTable
        columns={columns}
        rows={data?.requests}
        loading={loading}
        error={error}
        onRetry={refetch}
        pagination={data?.pagination}
        onPageChange={table.setPage}
        onLimitChange={table.setLimit}
        sort={query.sort}
        order={query.order}
        onSortChange={table.setSort}
        onRowClick={(row) => navigate(`/admin/requests/${row.id}`)}
        emptyTitle="No requests found"
        emptyAction={{ actionLabel: "Clear filters", onAction: table.resetFilters }}
      />
    </>
  );
}

export default AdminRequests;
