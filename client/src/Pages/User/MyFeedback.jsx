import { useCallback, useMemo, useState } from "react";
import { Alert, Button } from "@mui/material";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import PageHeader from "../../Components/Common/PageHeader";
import DataTable from "../../Components/Common/DataTable";
import TableToolbar from "../../Components/Common/TableToolbar";
import FilterSelect from "../../Components/Common/FilterSelect";
import ConfirmDialog from "../../Components/Common/ConfirmDialog";
import FeedbackDialog from "../../Components/Feedback/FeedbackDialog";
import { myFeedbackColumns, feedbackTarget } from "../../Components/Feedback/feedbackColumns";
import { useFetch } from "../../Hooks/useFetch";
import { useTableQuery } from "../../Hooks/useTableQuery";
import { useAsyncAction } from "../../Hooks/useAsyncAction";
import { createFeedback, deleteFeedback, getMyFeedback, updateFeedback } from "../../api/feedbackApi";
import { getCrops } from "../../api/cropsApi";

const statusOptions = [
  { value: "pending", label: "Waiting for review" },
  { value: "approved", label: "Published" },
  { value: "rejected", label: "Not approved" },
];

function MyFeedback() {
  const table = useTableQuery({ filters: ["status"] });
  const { query } = table;
  const fetchFeedback = useCallback(() => getMyFeedback(query), [query]);
  const { data, loading, error, refetch } = useFetch(fetchFeedback, [fetchFeedback]);
  const crops = useFetch(() => getCrops({ limit: 100, sort: "name", order: "asc" }).then((result) => ({ data: result })), []);
  const { run, pending } = useAsyncAction();
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const cropOptions = useMemo(
    () => (crops.data?.data ?? []).map((crop) => ({ value: crop.id, label: crop.name })),
    [crops.data],
  );

  const columns = useMemo(() => myFeedbackColumns({ onEdit: setEditing, onDelete: setDeleting }), []);

  const submitNew = (values) =>
    run(
      () =>
        createFeedback({
          ...(values.crop_id ? { crop_id: values.crop_id } : {}),
          rating: values.rating,
          comment: values.comment.trim(),
        }),
      {
        onSuccess: () => {
          setCreating(false);
          refetch();
        },
      },
    );

  const submitEdit = (values) =>
    run(() => updateFeedback(editing.id, { rating: values.rating, comment: values.comment.trim() }), {
      onSuccess: () => {
        setEditing(null);
        refetch();
      },
    });

  const confirmDelete = () =>
    run(() => deleteFeedback(deleting.id), {
      onSuccess: () => {
        setDeleting(null);
        refetch();
      },
    });

  return (
    <>
      <PageHeader
        title="My feedback"
        subtitle="Reviews you have written. They become public after our team approves them."
        actions={
          <Button variant="contained" startIcon={<RateReviewOutlinedIcon />} onClick={() => setCreating(true)}>
            Write a review
          </Button>
        }
      />

      <Alert severity="info" sx={{ mb: 2, borderRadius: 3 }}>
        To review a consultation, open the request after the agronomist answers it.
      </Alert>

      <TableToolbar
        search={query.search}
        onSearch={table.setSearch}
        placeholder="Search in your reviews..."
        showReset={Boolean(query.search || query.status)}
        onReset={table.resetFilters}
      >
        <FilterSelect
          label="Status"
          value={query.status}
          onChange={(value) => table.setFilter("status", value)}
          options={statusOptions}
          allLabel="All"
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
        emptyTitle="No reviews yet"
        emptyDescription="Share your experience with a crop guide or a consultation."
      />

      <FeedbackDialog
        open={creating}
        title="Write a review"
        subtitle="Review a crop guide or tell us about the platform."
        cropOptions={cropOptions}
        loading={pending}
        onSubmit={submitNew}
        onClose={() => setCreating(false)}
      />
      <FeedbackDialog
        open={Boolean(editing)}
        title="Edit review"
        subtitle={editing ? feedbackTarget(editing) : ""}
        initialValues={editing ? { rating: editing.rating, comment: editing.comment } : undefined}
        loading={pending}
        onSubmit={submitEdit}
        onClose={() => setEditing(null)}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this review?"
        message="Your review will be removed permanently."
        confirmText="Delete"
        confirmColor="error"
        loading={pending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}

export default MyFeedback;
