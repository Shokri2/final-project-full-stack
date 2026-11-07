import { useCallback, useState } from "react";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import LoadingState from "../../Components/Common/LoadingState";
import ErrorState from "../../Components/Common/ErrorState";
import ConfirmDialog from "../../Components/Common/ConfirmDialog";
import RequestDetailsLayout from "../../Components/Requests/RequestDetailsLayout";
import RequestReviewCard from "../../Components/Requests/RequestReviewCard";
import EditRequestDialog from "../../Components/Requests/EditRequestDialog";
import AddPhotosDialog from "../../Components/Requests/AddPhotosDialog";
import FeedbackDialog from "../../Components/Feedback/FeedbackDialog";
import { MAX_IMAGES } from "../../Components/Requests/requestOptions";
import { useFetch } from "../../Hooks/useFetch";
import { useAsyncAction } from "../../Hooks/useAsyncAction";
import {
  changeRequestStatus,
  deleteRequestImage,
  getRequest,
  updateRequest,
  uploadRequestImages,
} from "../../api/requestsApi";
import { createFeedback } from "../../api/feedbackApi";

function UserRequestDetails() {
  const { id } = useParams();
  const fetchRequest = useCallback(() => getRequest(id), [id]);
  const { data, setData, loading, error, refetch } = useFetch(fetchRequest, [fetchRequest]);
  const { run, pending } = useAsyncAction();
  const [dialog, setDialog] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);

  if (loading) {
    return <LoadingState message="Loading request..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const request = data.request;
  const canEdit = request.status === "pending";
  const canUpload = ["pending", "assigned"].includes(request.status);
  const remaining = MAX_IMAGES - request.attachments.length;

  const closeDialog = () => setDialog(null);
  const applyRequest = (response) => {
    setData({ request: response.data.request });
    closeDialog();
  };

  const changeStatus = (action) => run(() => changeRequestStatus(request.id, action), { onSuccess: applyRequest });

  const saveEdit = (changes) => run(() => updateRequest(request.id, changes), { onSuccess: applyRequest });

  const uploadPhotos = (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    return run(() => uploadRequestImages(request.id, formData), { onSuccess: applyRequest });
  };

  const deleteImage = () =>
    run(() => deleteRequestImage(request.id, imageToDelete.id), {
      onSuccess: () => {
        setImageToDelete(null);
        refetch();
      },
    });

  const submitReview = (values) =>
    run(() => createFeedback({ request_id: request.id, rating: values.rating, comment: values.comment.trim() }), {
      onSuccess: () => {
        closeDialog();
        refetch();
      },
    });

  const actions = (
    <>
      {canEdit && (
        <Button variant="outlined" startIcon={<EditOutlinedIcon />} onClick={() => setDialog("edit")}>
          Edit
        </Button>
      )}
      {canEdit && (
        <Button variant="outlined" color="error" startIcon={<CancelOutlinedIcon />} onClick={() => setDialog("cancel")}>
          Cancel request
        </Button>
      )}
      {request.status === "answered" && (
        <Button variant="contained" startIcon={<TaskAltOutlinedIcon />} onClick={() => setDialog("close")}>
          Mark as resolved
        </Button>
      )}
    </>
  );

  return (
    <>
      <RequestDetailsLayout
        request={request}
        breadcrumbs={[{ label: "My requests", to: "/user/requests" }, { label: `Request #${request.id}` }]}
        actions={canEdit || request.status === "answered" ? actions : null}
        onDeleteImage={canUpload ? setImageToDelete : undefined}
        imagesAction={
          canUpload && remaining > 0 ? (
            <Button size="small" startIcon={<AddPhotoAlternateOutlinedIcon />} onClick={() => setDialog("photos")}>
              Add photos
            </Button>
          ) : null
        }
      >
        <RequestReviewCard request={request} onReview={() => setDialog("review")} />
      </RequestDetailsLayout>

      <EditRequestDialog open={dialog === "edit"} request={request} loading={pending} onSubmit={saveEdit} onClose={closeDialog} />
      <AddPhotosDialog open={dialog === "photos"} remaining={remaining} loading={pending} onSubmit={uploadPhotos} onClose={closeDialog} />
      <FeedbackDialog
        open={dialog === "review"}
        title="Review this consultation"
        subtitle={`How helpful was the answer about ${request.crop.name}?`}
        loading={pending}
        onSubmit={submitReview}
        onClose={closeDialog}
      />
      <ConfirmDialog
        open={dialog === "cancel"}
        title="Cancel this request?"
        message="The request will be closed and no agronomist will work on it. This cannot be undone."
        confirmText="Cancel request"
        cancelText="Keep it"
        confirmColor="error"
        loading={pending}
        onConfirm={() => changeStatus("cancel")}
        onClose={closeDialog}
      />
      <ConfirmDialog
        open={dialog === "close"}
        title="Mark as resolved?"
        message="Close this consultation once the agronomist's answer solved your problem. You can still leave a review afterwards."
        confirmText="Mark as resolved"
        loading={pending}
        onConfirm={() => changeStatus("close")}
        onClose={closeDialog}
      />
      <ConfirmDialog
        open={Boolean(imageToDelete)}
        title="Delete this photo?"
        message="The photo will be permanently removed from the request."
        confirmText="Delete"
        confirmColor="error"
        loading={pending}
        onConfirm={deleteImage}
        onClose={() => setImageToDelete(null)}
      />
    </>
  );
}

export default UserRequestDetails;
