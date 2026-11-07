import { useCallback, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PageHeader from "../../Components/Common/PageHeader";
import DataTable from "../../Components/Common/DataTable";
import TableToolbar from "../../Components/Common/TableToolbar";
import FilterSelect from "../../Components/Common/FilterSelect";
import ConfirmDialog from "../../Components/Common/ConfirmDialog";
import RowActions from "../../Components/Common/RowActions";
import StatusChip from "../../Components/Common/StatusChip";
import MessageDialog from "../../Components/Admin/Messages/MessageDialog";
import { useFetch } from "../../Hooks/useFetch";
import { useTableQuery } from "../../Hooks/useTableQuery";
import { useAsyncAction } from "../../Hooks/useAsyncAction";
import { deleteContactMessage, getContactMessages, updateContactStatus } from "../../api/contactApi";
import { timeAgo } from "../../utils/format";

const statusOptions = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "archived", label: "Archived" },
];

function ContactMessages() {
  const table = useTableQuery({ filters: ["status"] });
  const { query } = table;
  const fetchMessages = useCallback(() => getContactMessages(query), [query]);
  const { data, loading, error, refetch } = useFetch(fetchMessages, [fetchMessages]);
  const { run, pending } = useAsyncAction();
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const setStatus = useCallback(
    (message, status, silent) =>
      run(() => updateContactStatus(message.id, status), {
        success: silent ? false : undefined,
        onSuccess: (response) => {
          setViewing((current) => (current?.id === message.id ? response.data.contact : current));
          refetch();
        },
      }),
    [run, refetch],
  );

  const open = useCallback(
    (message) => {
      setViewing(message);

      if (message.status === "new") {
        setStatus(message, "read", true);
      }
    },
    [setStatus],
  );

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "From",
        render: (row) => (
          <Box sx={{ maxWidth: 220 }}>
            <Typography fontWeight={row.status === "new" ? 800 : 600} noWrap>
              {row.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {row.email}
            </Typography>
          </Box>
        ),
      },
      {
        field: "subject",
        headerName: "Message",
        render: (row) => (
          <Box sx={{ maxWidth: 380 }}>
            <Typography fontWeight={row.status === "new" ? 800 : 500} noWrap>
              {row.subject}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {row.message}
            </Typography>
          </Box>
        ),
      },
      { field: "status", headerName: "Status", render: (row) => <StatusChip status={row.status} /> },
      { field: "created_at", headerName: "Received", sortField: "created_at", render: (row) => timeAgo(row.created_at) },
      {
        field: "actions",
        headerName: "",
        align: "right",
        render: (row) => (
          <RowActions
            actions={[
              {
                label: "Mark as read",
                icon: <MarkEmailReadOutlinedIcon fontSize="small" />,
                hidden: row.status !== "new",
                onClick: () => setStatus(row, "read"),
              },
              {
                label: "Archive",
                icon: <ArchiveOutlinedIcon fontSize="small" />,
                hidden: row.status === "archived",
                onClick: () => setStatus(row, "archived"),
              },
              { label: "Delete", icon: <DeleteOutlineIcon fontSize="small" />, color: "error", onClick: () => setDeleting(row) },
            ]}
          />
        ),
      },
    ],
    [setStatus],
  );

  return (
    <>
      <PageHeader title="Contact messages" subtitle="Messages sent from the public contact form." />

      <TableToolbar
        search={query.search}
        onSearch={table.setSearch}
        placeholder="Search by name, email, subject or message..."
        showReset={Boolean(query.search || query.status)}
        onReset={table.resetFilters}
      >
        <FilterSelect label="Status" value={query.status} onChange={(value) => table.setFilter("status", value)} options={statusOptions} />
      </TableToolbar>

      <DataTable
        columns={columns}
        rows={data?.messages}
        loading={loading}
        error={error}
        onRetry={refetch}
        pagination={data?.pagination}
        onPageChange={table.setPage}
        onLimitChange={table.setLimit}
        sort={query.sort}
        order={query.order}
        onSortChange={table.setSort}
        onRowClick={open}
        emptyTitle="No messages"
        emptyDescription="Messages from the contact page will appear here."
      />

      <MessageDialog
        message={viewing}
        onClose={() => setViewing(null)}
        onArchive={(message) => setStatus(message, "archived")}
        onDelete={setDeleting}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this message?"
        message="The message will be permanently deleted."
        confirmText="Delete"
        confirmColor="error"
        loading={pending}
        onConfirm={() =>
          run(() => deleteContactMessage(deleting.id), {
            onSuccess: () => {
              setDeleting(null);
              setViewing(null);
              refetch();
            },
          })
        }
        onClose={() => setDeleting(null)}
      />
    </>
  );
}

export default ContactMessages;
