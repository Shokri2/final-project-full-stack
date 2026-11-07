import { useCallback, useState } from "react";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import LoadingState from "../../Components/Common/LoadingState";
import ErrorState from "../../Components/Common/ErrorState";
import ConfirmDialog from "../../Components/Common/ConfirmDialog";
import RequestDetailsLayout from "../../Components/Requests/RequestDetailsLayout";
import AssignDialog from "../../Components/Requests/AssignDialog";
import { useFetch } from "../../Hooks/useFetch";
import { useAsyncAction } from "../../Hooks/useAsyncAction";
import { changeRequestStatus, getRequest } from "../../api/requestsApi";

function AdminRequestDetails() {
  const { id } = useParams();
  const fetchRequest = useCallback(() => getRequest(id), [id]);
  const { data, setData, loading, error, refetch } = useFetch(fetchRequest, [fetchRequest]);
  const { run, pending } = useAsyncAction();
  const [dialog, setDialog] = useState(null);

  if (loading) {
    return <LoadingState message="Loading request..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const request = data.request;
  const canAssign = ["pending", "assigned"].includes(request.status);
  const canReject = ["pending", "assigned", "in_progress"].includes(request.status);
  const canClose = request.status === "answered";

  const perform = (action, body) =>
    run(() => changeRequestStatus(request.id, action, body), {
      onSuccess: (response) => {
        setData({ request: response.data.request });
        setDialog(null);
      },
    });

  const hasActions = canAssign || canReject || canClose;

  return (
    <>
      <RequestDetailsLayout
        request={request}
        showFarmer
        breadcrumbs={[{ label: "Requests", to: "/admin/requests" }, { label: `Request #${request.id}` }]}
        actions={
          hasActions ? (
            <>
              {canAssign && (
                <Button variant="contained" startIcon={<PersonAddAlt1OutlinedIcon />} onClick={() => setDialog("assign")}>
                  {request.agronomist ? "Reassign" : "Assign agronomist"}
                </Button>
              )}
              {canClose && (
                <Button variant="contained" startIcon={<TaskAltOutlinedIcon />} onClick={() => setDialog("close")}>
                  Close request
                </Button>
              )}
              {canReject && (
                <Button variant="outlined" color="error" startIcon={<BlockOutlinedIcon />} onClick={() => setDialog("reject")}>
                  Reject
                </Button>
              )}
            </>
          ) : null
        }
      />

      <AssignDialog
        open={dialog === "assign"}
        request={request}
        loading={pending}
        onSubmit={(body) => perform("assign", body)}
        onClose={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === "close"}
        title="Close this request?"
        message="Use this when the farmer has the answer they need but didn't close it themselves."
        confirmText="Close request"
        loading={pending}
        onConfirm={() => perform("close")}
        onClose={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === "reject"}
        title="Reject this request?"
        message="The farmer will see your reason. The request will be closed."
        confirmText="Reject request"
        confirmColor="error"
        requireReason
        reasonLabel="Reason for rejection"
        reasonMinLength={10}
        loading={pending}
        onConfirm={(reason) => perform("reject", { reason })}
        onClose={() => setDialog(null)}
      />
    </>
  );
}

export default AdminRequestDetails;
