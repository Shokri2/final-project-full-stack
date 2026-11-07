import { useCallback, useState } from "react";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import LoadingState from "../../Components/Common/LoadingState";
import ErrorState from "../../Components/Common/ErrorState";
import ConfirmDialog from "../../Components/Common/ConfirmDialog";
import RequestDetailsLayout from "../../Components/Requests/RequestDetailsLayout";
import AnswerDialog from "../../Components/Requests/AnswerDialog";
import { useFetch } from "../../Hooks/useFetch";
import { useAsyncAction } from "../../Hooks/useAsyncAction";
import { changeRequestStatus, getRequest } from "../../api/requestsApi";

function AgronomistRequestDetails() {
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
  const canReject = ["assigned", "in_progress"].includes(request.status);

  const perform = (action, body) =>
    run(() => changeRequestStatus(request.id, action, body), {
      onSuccess: (response) => {
        setData({ request: response.data.request });
        setDialog(null);
      },
    });

  const actions = (
    <>
      {request.status === "assigned" && (
        <Button variant="contained" startIcon={<PlayArrowOutlinedIcon />} onClick={() => setDialog("start")}>
          Start working
        </Button>
      )}
      {request.status === "in_progress" && (
        <Button variant="contained" startIcon={<SendOutlinedIcon />} onClick={() => setDialog("answer")}>
          Write answer
        </Button>
      )}
      {canReject && (
        <Button variant="outlined" color="error" startIcon={<BlockOutlinedIcon />} onClick={() => setDialog("reject")}>
          Reject
        </Button>
      )}
    </>
  );

  return (
    <>
      <RequestDetailsLayout
        request={request}
        showFarmer
        breadcrumbs={[{ label: "Assigned requests", to: "/agronomist/requests" }, { label: `Request #${request.id}` }]}
        actions={canReject ? actions : null}
      />

      <ConfirmDialog
        open={dialog === "start"}
        title="Start working on this request?"
        message="The farmer will see that you are working on it. You can then write your answer."
        confirmText="Start working"
        loading={pending}
        onConfirm={() => perform("start")}
        onClose={() => setDialog(null)}
      />
      <AnswerDialog
        open={dialog === "answer"}
        request={request}
        loading={pending}
        onSubmit={(body) => perform("answer", body)}
        onClose={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === "reject"}
        title="Reject this request?"
        message="Explain why so the farmer understands. The request will be closed."
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

export default AgronomistRequestDetails;
