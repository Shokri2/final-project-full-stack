import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import StatusChip from "../Common/StatusChip";
import { feedbackTarget } from "./feedbackColumns";
import { formatDateTime } from "../../utils/format";

function Detail({ label, children }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ textAlign: "right", wordBreak: "break-word" }}>
        {children}
      </Typography>
    </Box>
  );
}

function FeedbackDetailsDialog({ feedback, onClose, onApprove, onReject }) {
  return (
    <Dialog open={Boolean(feedback)} onClose={onClose} fullWidth maxWidth="sm">
      {feedback && (
        <>
          <DialogTitle fontWeight={800}>Feedback details</DialogTitle>
          <DialogContent>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
              <Rating value={feedback.rating} readOnly />
              <StatusChip status={feedback.status} />
            </Stack>
            <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8, mb: 2 }}>{feedback.comment}</Typography>
            {feedback.rejection_reason && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Rejected: {feedback.rejection_reason}
              </Alert>
            )}
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1}>
              <Detail label="Author">
                {feedback.user_name} {feedback.user_email ? `(${feedback.user_email})` : ""}
              </Detail>
              <Detail label="About">{feedbackTarget(feedback)}</Detail>
              <Detail label="Submitted">{formatDateTime(feedback.created_at)}</Detail>
              {feedback.reviewed_at && <Detail label="Reviewed">{formatDateTime(feedback.reviewed_at)}</Detail>}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} color="inherit">
              Close
            </Button>
            {feedback.status !== "rejected" && (
              <Button color="error" variant="outlined" onClick={() => onReject(feedback)}>
                Reject
              </Button>
            )}
            {feedback.status !== "approved" && (
              <Button color="success" variant="contained" onClick={() => onApprove(feedback)}>
                Approve
              </Button>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default FeedbackDetailsDialog;
