import { Button, Paper, Rating, Stack, Typography } from "@mui/material";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import StatusChip from "../Common/StatusChip";

function RequestReviewCard({ request, onReview }) {
  const canReview = ["answered", "closed"].includes(request.status);

  if (!request.feedback && !canReview) {
    return null;
  }

  return (
    <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 1.5 }}>
        Your review
      </Typography>
      {request.feedback ? (
        <>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1 }}>
            <Rating value={request.feedback.rating} readOnly />
            <StatusChip
              status={request.feedback.status}
              label={request.feedback.status === "approved" ? "Published" : undefined}
            />
          </Stack>
          <Typography color="text.secondary">{request.feedback.comment}</Typography>
        </>
      ) : (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}>
          <Typography color="text.secondary">Was the answer helpful? Rate this consultation.</Typography>
          <Button variant="contained" startIcon={<RateReviewOutlinedIcon />} onClick={onReview}>
            Leave a review
          </Button>
        </Stack>
      )}
    </Paper>
  );
}

export default RequestReviewCard;
