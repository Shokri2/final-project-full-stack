import { useCallback, useMemo, useState } from "react";
import { Button, Chip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PageHeader from "../../Components/Common/PageHeader";
import DataTable from "../../Components/Common/DataTable";
import TableToolbar from "../../Components/Common/TableToolbar";
import ConfirmDialog from "../../Components/Common/ConfirmDialog";
import RowActions from "../../Components/Common/RowActions";
import CategoryFormDialog from "../../Components/Admin/Categories/CategoryFormDialog";
import CategoryDetailsDialog from "../../Components/Admin/Categories/CategoryDetailsDialog";
import { useFetch } from "../../Hooks/useFetch";
import { useTableQuery } from "../../Hooks/useTableQuery";
import { useAsyncAction } from "../../Hooks/useAsyncAction";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../api/categoriesApi";
import { formatDate } from "../../utils/format";

function CategoriesPage() {
  const table = useTableQuery({ sort: "name", order: "asc" });
  const { query } = table;
  const fetchCategories = useCallback(() => getCategories(query), [query]);
  const { data, loading, error, refetch } = useFetch(fetchCategories, [fetchCategories]);
  const { run, pending } = useAsyncAction();
  const [editing, setEditing] = useState(undefined);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Category",
        sortField: "name",
        render: (row) => (
          <>
            <Typography fontWeight={700}>{row.name}</Typography>
            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 360 }}>
              {row.description || "—"}
            </Typography>
          </>
        ),
      },
      {
        field: "crops_count",
        headerName: "Crops",
        sortField: "crops_count",
        render: (row) => <Chip size="small" label={`${row.active_crops_count} active / ${row.crops_count}`} />,
      },
      { field: "created_at", headerName: "Created", sortField: "created_at", render: (row) => formatDate(row.created_at) },
      {
        field: "actions",
        headerName: "",
        align: "right",
        render: (row) => (
          <RowActions
            actions={[
              { label: "View details", icon: <VisibilityOutlinedIcon fontSize="small" />, onClick: () => setViewing(row) },
              { label: "Edit", icon: <EditOutlinedIcon fontSize="small" />, onClick: () => setEditing(row) },
              {
                label: row.crops_count > 0 ? "Move or delete its crops first" : "Delete",
                icon: <DeleteOutlineIcon fontSize="small" />,
                color: "error",
                disabled: row.crops_count > 0,
                onClick: () => setDeleting(row),
              },
            ]}
          />
        ),
      },
    ],
    [],
  );

  const done = () => {
    setEditing(undefined);
    setDeleting(null);
    refetch();
  };

  const save = (values) => run(() => (editing ? updateCategory(editing.id, values) : createCategory(values)), { onSuccess: done });
  const remove = () => run(() => deleteCategory(deleting.id), { onSuccess: done });

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Group crops and define what each agronomist specialises in."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setEditing(null)}>
            New category
          </Button>
        }
      />

      <TableToolbar search={query.search} onSearch={table.setSearch} placeholder="Search categories..." />

      <DataTable
        columns={columns}
        rows={data?.categories}
        loading={loading}
        error={error}
        onRetry={refetch}
        pagination={data?.pagination}
        onPageChange={table.setPage}
        onLimitChange={table.setLimit}
        sort={query.sort}
        order={query.order}
        onSortChange={table.setSort}
        onRowClick={setViewing}
        emptyTitle="No categories found"
      />

      <CategoryFormDialog open={editing !== undefined} category={editing} loading={pending} onSubmit={save} onClose={() => setEditing(undefined)} />
      <CategoryDetailsDialog category={viewing} onClose={() => setViewing(null)} />
      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Delete "${deleting?.name}"?`}
        message="This category has no crops. Agronomist specialties for it will also be removed."
        confirmText="Delete"
        confirmColor="error"
        loading={pending}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}

export default CategoriesPage;
