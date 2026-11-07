import { useCallback } from "react";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "../../Components/Common/PageHeader";
import DataTable from "../../Components/Common/DataTable";
import RequestFilters from "../../Components/Requests/RequestFilters";
import {
  agronomistColumn,
  createdColumn,
  priorityColumn,
  statusColumn,
  titleColumn,
  updatedColumn,
} from "../../Components/Requests/requestColumns";
import { useFetch } from "../../Hooks/useFetch";
import { useTableQuery } from "../../Hooks/useTableQuery";
import { getRequests } from "../../api/requestsApi";

const columns = [titleColumn, statusColumn, priorityColumn, agronomistColumn, createdColumn, updatedColumn];

function MyRequests() {
  const navigate = useNavigate();
  const table = useTableQuery({ filters: ["status", "priority"] });
  const { query } = table;

  const fetchRequests = useCallback(() => getRequests(query), [query]);
  const { data, loading, error, refetch } = useFetch(fetchRequests, [fetchRequests]);

  return (
    <>
      <PageHeader
        title="My requests"
        subtitle="Track every consultation you have submitted."
        actions={
          <Button component={Link} to="/user/requests/new" variant="contained" startIcon={<AddIcon />}>
            New request
          </Button>
        }
      />

      <RequestFilters {...table} />

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
        onRowClick={(row) => navigate(`/user/requests/${row.id}`)}
        emptyTitle={query.search || query.status || query.priority ? "No matching requests" : "No requests yet"}
        emptyDescription={
          query.search || query.status || query.priority
            ? "Try changing your search or filters."
            : "Ask an agronomist about your crop to get started."
        }
        emptyAction={
          query.search || query.status || query.priority
            ? { actionLabel: "Clear filters", onAction: table.resetFilters }
            : { actionLabel: "New request", onAction: () => navigate("/user/requests/new") }
        }
      />
    </>
  );
}

export default MyRequests;
