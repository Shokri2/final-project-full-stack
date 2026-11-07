import { useCallback, useMemo } from "react";
import { Box, Chip, Link as MuiLink, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import PageHeader from "../../Components/Common/PageHeader";
import DataTable from "../../Components/Common/DataTable";
import TableToolbar from "../../Components/Common/TableToolbar";
import FilterSelect from "../../Components/Common/FilterSelect";
import { useFetch } from "../../Hooks/useFetch";
import { useTableQuery } from "../../Hooks/useTableQuery";
import { getActivities, getActivityActions } from "../../api/activitiesApi";
import { formatDateTime, formatLabel } from "../../utils/format";
import { ROLE_LABELS } from "../../utils/roles";

const entityOptions = ["request", "user", "crop", "category", "feedback", "contact"].map((value) => ({
  value,
  label: formatLabel(value),
}));

const entityLinks = {
  request: (id) => `/admin/requests/${id}`,
  user: (id) => `/admin/users/${id}`,
  crop: (id) => `/admin/crops/${id}`,
};

const describeDetails = (details) => {
  if (!details) {
    return "";
  }

  if (details.from && details.to) {
    return `${formatLabel(details.from)} → ${formatLabel(details.to)}`;
  }

  return Object.entries(details)
    .map(([key, value]) => `${formatLabel(key)}: ${Array.isArray(value) ? value.join(", ") : value}`)
    .join(" · ");
};

const columns = [
  { field: "created_at", headerName: "When", sortField: "created_at", render: (row) => formatDateTime(row.created_at) },
  {
    field: "user_name",
    headerName: "Who",
    render: (row) => (
      <Box>
        <Typography fontWeight={600}>{row.user_name ?? "System"}</Typography>
        {row.user_role && (
          <Typography variant="caption" color="text.secondary">
            {ROLE_LABELS[row.user_role]}
          </Typography>
        )}
      </Box>
    ),
  },
  { field: "action", headerName: "Action", render: (row) => <Chip size="small" label={formatLabel(row.action)} /> },
  {
    field: "entity",
    headerName: "Target",
    render: (row) =>
      row.entity_type ? (
        entityLinks[row.entity_type] && row.entity_id ? (
          <MuiLink component={Link} to={entityLinks[row.entity_type](row.entity_id)} onClick={(event) => event.stopPropagation()}>
            {formatLabel(row.entity_type)} #{row.entity_id}
          </MuiLink>
        ) : (
          `${formatLabel(row.entity_type)}${row.entity_id ? ` #${row.entity_id}` : ""}`
        )
      ) : (
        "—"
      ),
  },
  {
    field: "details",
    headerName: "Details",
    render: (row) => (
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }} noWrap>
        {describeDetails(row.details) || "—"}
      </Typography>
    ),
  },
];

function ActivityLog() {
  const table = useTableQuery({ limit: 20, filters: ["action", "entity_type", "from", "to"] });
  const { query } = table;
  const fetchActivities = useCallback(
    () => getActivities({ ...query, to: query.to ? `${query.to}T23:59:59` : "" }),
    [query],
  );
  const { data, loading, error, refetch } = useFetch(fetchActivities, [fetchActivities]);
  const actions = useFetch(getActivityActions, []);

  const actionOptions = useMemo(
    () => (actions.data?.actions ?? []).map((action) => ({ value: action, label: formatLabel(action) })),
    [actions.data],
  );

  const filtered = Boolean(query.search || query.action || query.entity_type || query.from || query.to);

  return (
    <>
      <PageHeader title="Activity log" subtitle="Every important action in the system, newest first." />

      <TableToolbar
        search={query.search}
        onSearch={table.setSearch}
        placeholder="Search by user or action..."
        showReset={filtered}
        onReset={table.resetFilters}
      >
        <FilterSelect label="Action" value={query.action} onChange={(value) => table.setFilter("action", value)} options={actionOptions} minWidth={190} />
        <FilterSelect label="Target" value={query.entity_type} onChange={(value) => table.setFilter("entity_type", value)} options={entityOptions} minWidth={130} />
        <TextField
          size="small"
          type="date"
          label="From"
          value={query.from}
          onChange={(event) => table.setFilter("from", event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          size="small"
          type="date"
          label="To"
          value={query.to}
          onChange={(event) => table.setFilter("to", event.target.value)}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: query.from || undefined } }}
        />
      </TableToolbar>

      <DataTable
        columns={columns}
        rows={data?.activities}
        loading={loading}
        error={error}
        onRetry={refetch}
        pagination={data?.pagination}
        onPageChange={table.setPage}
        onLimitChange={table.setLimit}
        sort={query.sort}
        order={query.order}
        onSortChange={table.setSort}
        emptyTitle="No activity found"
        emptyAction={filtered ? { actionLabel: "Clear filters", onAction: table.resetFilters } : undefined}
      />
    </>
  );
}

export default ActivityLog;
