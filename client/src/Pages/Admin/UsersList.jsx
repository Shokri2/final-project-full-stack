import { useCallback, useRef, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PageHeader from "../../Components/Common/PageHeader";
import DataTable from "../../Components/Common/DataTable";
import TableToolbar from "../../Components/Common/TableToolbar";
import FilterSelect from "../../Components/Common/FilterSelect";
import CreateUserDialog from "../../Components/Admin/Users/CreateUserDialog";
import { ROLE_OPTIONS, userColumns } from "../../Components/Admin/Users/userColumns";
import { useFetch } from "../../Hooks/useFetch";
import { useTableQuery } from "../../Hooks/useTableQuery";
import { useAsyncAction } from "../../Hooks/useAsyncAction";
import { useCategoryOptions } from "../../Hooks/useCategoryOptions";
import { createUser, getUsers } from "../../api/usersApi";
import { applyFieldErrors } from "../../utils/errors";

const statusOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const verifiedOptions = [
  { value: "true", label: "Verified" },
  { value: "false", label: "Not verified" },
];

function UsersList() {
  const navigate = useNavigate();
  const table = useTableQuery({ filters: ["role", "is_active", "email_verified"] });
  const { query } = table;
  const fetchUsers = useCallback(() => getUsers(query), [query]);
  const { data, loading, error, refetch } = useFetch(fetchUsers, [fetchUsers]);
  const { options: categoryOptions } = useCategoryOptions();
  const { run, pending } = useAsyncAction();
  const [creating, setCreating] = useState(false);
  const setErrorRef = useRef(null);

  const create = (values) =>
    run(() => createUser(values), {
      onSuccess: (response) => {
        setCreating(false);
        navigate(`/admin/users/${response.data.user.id}`);
      },
      onError: (requestError) => {
        if (setErrorRef.current) {
          applyFieldErrors(requestError, setErrorRef.current);
        }

        return false;
      },
    });

  const filtered = Boolean(query.search || query.role || query.is_active || query.email_verified);

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Manage farmers, agronomists and admins."
        actions={
          <Button variant="contained" startIcon={<PersonAddAltOutlinedIcon />} onClick={() => setCreating(true)}>
            Create user
          </Button>
        }
      />

      <TableToolbar
        search={query.search}
        onSearch={table.setSearch}
        placeholder="Search by name, email or phone..."
        showReset={filtered}
        onReset={table.resetFilters}
      >
        <FilterSelect label="Role" value={query.role} onChange={(value) => table.setFilter("role", value)} options={ROLE_OPTIONS} minWidth={140} />
        <FilterSelect
          label="Status"
          value={query.is_active}
          onChange={(value) => table.setFilter("is_active", value)}
          options={statusOptions}
          minWidth={130}
        />
        <FilterSelect
          label="Email"
          value={query.email_verified}
          onChange={(value) => table.setFilter("email_verified", value)}
          options={verifiedOptions}
          minWidth={140}
        />
      </TableToolbar>

      <DataTable
        columns={userColumns}
        rows={data?.users}
        loading={loading}
        error={error}
        onRetry={refetch}
        pagination={data?.pagination}
        onPageChange={table.setPage}
        onLimitChange={table.setLimit}
        sort={query.sort}
        order={query.order}
        onSortChange={table.setSort}
        onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
        emptyTitle="No users found"
        emptyAction={filtered ? { actionLabel: "Clear filters", onAction: table.resetFilters } : undefined}
      />

      <CreateUserDialog
        open={creating}
        categoryOptions={categoryOptions}
        loading={pending}
        onSubmit={create}
        onClose={() => setCreating(false)}
        setErrorRef={setErrorRef}
      />
    </>
  );
}

export default UsersList;
