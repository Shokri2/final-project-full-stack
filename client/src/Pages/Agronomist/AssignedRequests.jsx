import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../Components/Common/PageHeader";
import DataTable from "../../Components/Common/DataTable";
import RequestFilters from "../../Components/Requests/RequestFilters";
import {
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

const columns = [titleColumn, farmerColumn, statusColumn, priorityColumn, createdColumn, updatedColumn];

function AssignedRequests() {
  const navigate = useNavigate();
  const table = useTableQuery({ filters: ["status", "priority"], sort: "priority", order: "desc" });
  const { query } = table;

  const fetchRequests = useCallback(() => getRequests(query), [query]);
  const { data, loading, error, refetch } = useFetch(fetchRequests, [fetchRequests]);
  const filtered = Boolean(query.search || query.status || query.priority);

  return (
    <>
      <PageHeader title="Assigned requests" subtitle="Consultations the admin assigned to you." />

      <RequestFilters {...table} placeholder="Search by title, crop or farmer..." />

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
        onRowClick={(row) => navigate(`/agronomist/requests/${row.id}`)}
        emptyTitle={filtered ? "No matching requests" : "No requests assigned yet"}
        emptyDescription={filtered ? "Try changing your search or filters." : "New assignments will appear here."}
        emptyAction={filtered ? { actionLabel: "Clear filters", onAction: table.resetFilters } : undefined}
      />
    </>
  );
}

export default AssignedRequests;
