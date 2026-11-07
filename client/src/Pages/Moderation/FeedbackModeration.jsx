import { useCallback, useMemo, useState } from "react";
import { Paper, Tab, Tabs } from "@mui/material";
import PageHeader from "../../Components/Common/PageHeader";
import DataTable from "../../Components/Common/DataTable";
import TableToolbar from "../../Components/Common/TableToolbar";
import FilterSelect from "../../Components/Common/FilterSelect";
import ConfirmDialog from "../../Components/Common/ConfirmDialog";
import FeedbackDetailsDialog from "../../Components/Feedback/FeedbackDetailsDialog";
import { moderationColumns } from "../../Components/Feedback/moderationColumns";
import { useFetch } from "../../Hooks/useFetch";
import { useTableQuery } from "../../Hooks/useTableQuery";
import { useAsyncAction } from "../../Hooks/useAsyncAction";
import { approveFeedback, getManagedFeedback, rejectFeedback } from "../../api/feedbackApi";

const tabs = [
  { value: "pending", label: "Waiting" },
  { value: "approved", label: "Published" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

const typeOptions = [
  { value: "request", label: "Consultations" },
  { value: "crop", label: "Crop guides" },
  { value: "platform", label: "Platform" },
];

const ratingOptions = [5, 4, 3, 2, 1].map((value) => ({ value: String(value), label: `${value} star${value > 1 ? "s" : ""}` }));

function FeedbackModeration({ subtitle }) {
  const table = useTableQuery({ filters: ["status", "type", "rating"] });
  const { query } = table;
  const status = query.status || "pending";
  const { run, pending } = useAsyncAction();
  const [viewing, setViewing] = useState(null);
  const [approving, setApproving] = useState(null);
  const [rejecting, setRejecting] = useState(null);

  const fetchFeedback = useCallback(
    () => getManagedFeedback({ ...query, status: status === "all" ? "" : status }),
    [query, status],
  );
  const { data, loading, error, refetch } = useFetch(fetchFeedback, [fetchFeedback]);

  const columns = useMemo(
    () => moderationColumns({ onView: setViewing, onApprove: setApproving, onReject: setRejecting }),
    [],
  );

  const done = () => {
    setApproving(null);
    setRejecting(null);
    setViewing(null);
    refetch();
  };

  const approve = () => run(() => approveFeedback(approving.id), { onSuccess: done });
  const reject = (reason) => run(() => rejectFeedback(rejecting.id, reason), { onSuccess: done });

  return (
    <>
      <PageHeader title="Feedback review" subtitle={subtitle} />

      <Paper elevation={0} sx={{ mb: 2, border: 1, borderColor: "divider", borderRadius: 3 }}>
        <Tabs
          value={status}
          onChange={(_, value) => table.setFilter("status", value === "pending" ? "" : value)}
          variant="scrollable"
          allowScrollButtonsMobile
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      <TableToolbar
        search={query.search}
        onSearch={table.setSearch}
        placeholder="Search by comment, author or crop..."
        showReset={Boolean(query.search || query.type || query.rating)}
        onReset={() => {
          table.resetFilters();
        }}
      >
        <FilterSelect label="Type" value={query.type} onChange={(value) => table.setFilter("type", value)} options={typeOptions} />
        <FilterSelect
          label="Rating"
          value={query.rating}
          onChange={(value) => table.setFilter("rating", value)}
          options={ratingOptions}
          allLabel="Any rating"
          minWidth={140}
        />
      </TableToolbar>

      <DataTable
        columns={columns}
        rows={data?.feedback}
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
        emptyTitle={status === "pending" ? "All caught up" : "No feedback found"}
        emptyDescription={status === "pending" ? "There is no feedback waiting for review." : "Try another tab or filter."}
      />

      <FeedbackDetailsDialog feedback={viewing} onClose={() => setViewing(null)} onApprove={setApproving} onReject={setRejecting} />
      <ConfirmDialog
        open={Boolean(approving)}
        title="Approve this feedback?"
        message="It will be shown publicly on the website."
        confirmText="Approve"
        confirmColor="success"
        loading={pending}
        onConfirm={approve}
        onClose={() => setApproving(null)}
      />
      <ConfirmDialog
        open={Boolean(rejecting)}
        title="Reject this feedback?"
        message="It will be hidden from the public. The author will see your reason."
        confirmText="Reject"
        confirmColor="error"
        requireReason
        reasonLabel="Reason"
        loading={pending}
        onConfirm={reject}
        onClose={() => setRejecting(null)}
      />
    </>
  );
}

export default FeedbackModeration;
