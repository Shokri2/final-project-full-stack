import { useCallback, useMemo, useState } from "react";
import { Avatar, Box, Button, Chip, Stack, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PageHeader from "../../Components/Common/PageHeader";
import DataTable from "../../Components/Common/DataTable";
import TableToolbar from "../../Components/Common/TableToolbar";
import FilterSelect from "../../Components/Common/FilterSelect";
import ConfirmDialog from "../../Components/Common/ConfirmDialog";
import RowActions from "../../Components/Common/RowActions";
import { useFetch } from "../../Hooks/useFetch";
import { useTableQuery } from "../../Hooks/useTableQuery";
import { useAsyncAction } from "../../Hooks/useAsyncAction";
import { useCategoryOptions } from "../../Hooks/useCategoryOptions";
import { deleteCrop, getManagedCrops, updateCropStatus } from "../../api/cropsApi";
import { getCropImage } from "../../utils/cropImages";

const visibilityOptions = [
  { value: "true", label: "Visible" },
  { value: "false", label: "Hidden" },
];

function CropsAdmin() {
  const navigate = useNavigate();
  const table = useTableQuery({ sort: "name", order: "asc", filters: ["category_id", "is_active"] });
  const { query } = table;
  const fetchCrops = useCallback(() => getManagedCrops(query), [query]);
  const { data, loading, error, refetch } = useFetch(fetchCrops, [fetchCrops]);
  const { options: categoryOptions } = useCategoryOptions();
  const { run, pending } = useAsyncAction();
  const [toggling, setToggling] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Crop",
        sortField: "name",
        render: (row) => (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Avatar variant="rounded" src={getCropImage(row)} sx={{ width: 44, height: 44 }} />
            <Box>
              <Typography fontWeight={700}>{row.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {row.name_ar}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      { field: "category_name", headerName: "Category" },
      {
        field: "growth_duration_days",
        headerName: "Days",
        sortField: "growth_duration_days",
        render: (row) => row.growth_duration_days ?? "—",
      },
      { field: "requests_count", headerName: "Requests", sortField: "requests_count" },
      {
        field: "is_active",
        headerName: "Visibility",
        render: (row) => <Chip size="small" label={row.is_active ? "Visible" : "Hidden"} color={row.is_active ? "success" : "default"} />,
      },
      {
        field: "actions",
        headerName: "",
        align: "right",
        render: (row) => (
          <RowActions
            actions={[
              { label: "Edit", icon: <EditOutlinedIcon fontSize="small" />, onClick: () => navigate(`/admin/crops/${row.id}`) },
              {
                label: row.is_active ? "Hide from farmers" : "Show to farmers",
                icon: row.is_active ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />,
                onClick: () => setToggling(row),
              },
              {
                label: row.requests_count > 0 ? "Has requests — hide it instead" : "Delete",
                icon: <DeleteOutlineIcon fontSize="small" />,
                color: "error",
                disabled: row.requests_count > 0,
                onClick: () => setDeleting(row),
              },
            ]}
          />
        ),
      },
    ],
    [navigate],
  );

  const done = () => {
    setToggling(null);
    setDeleting(null);
    refetch();
  };

  const filtered = Boolean(query.search || query.category_id || query.is_active);

  return (
    <>
      <PageHeader
        title="Crops"
        subtitle="Crop guides shown to farmers, including hidden ones."
        actions={
          <Button component={Link} to="/admin/crops/new" variant="contained" startIcon={<AddIcon />}>
            New crop
          </Button>
        }
      />

      <TableToolbar
        search={query.search}
        onSearch={table.setSearch}
        placeholder="Search by English or Arabic name..."
        showReset={filtered}
        onReset={table.resetFilters}
      >
        <FilterSelect
          label="Category"
          value={query.category_id}
          onChange={(value) => table.setFilter("category_id", value)}
          options={categoryOptions}
          minWidth={180}
        />
        <FilterSelect
          label="Visibility"
          value={query.is_active}
          onChange={(value) => table.setFilter("is_active", value)}
          options={visibilityOptions}
          minWidth={140}
        />
      </TableToolbar>

      <DataTable
        columns={columns}
        rows={data?.data}
        loading={loading}
        error={error}
        onRetry={refetch}
        pagination={data?.pagination}
        onPageChange={table.setPage}
        onLimitChange={table.setLimit}
        sort={query.sort}
        order={query.order}
        onSortChange={table.setSort}
        onRowClick={(row) => navigate(`/admin/crops/${row.id}`)}
        emptyTitle="No crops found"
        emptyAction={filtered ? { actionLabel: "Clear filters", onAction: table.resetFilters } : undefined}
      />

      <ConfirmDialog
        open={Boolean(toggling)}
        title={toggling?.is_active ? `Hide ${toggling?.name}?` : `Show ${toggling?.name}?`}
        message={
          toggling?.is_active
            ? "Farmers won't see this crop or be able to create new requests for it. Existing requests stay."
            : "Farmers will see this crop again."
        }
        confirmText={toggling?.is_active ? "Hide" : "Show"}
        loading={pending}
        onConfirm={() => run(() => updateCropStatus(toggling.id, !toggling.is_active), { onSuccess: done })}
        onClose={() => setToggling(null)}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Delete ${deleting?.name}?`}
        message="The crop and its growth stages will be permanently deleted. This cannot be undone."
        confirmText="Delete"
        confirmColor="error"
        loading={pending}
        onConfirm={() => run(() => deleteCrop(deleting.id), { onSuccess: done })}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}

export default CropsAdmin;
