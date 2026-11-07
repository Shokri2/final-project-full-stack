import { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
  loading = false,
  requireReason = false,
  reasonLabel = "Reason",
  reasonMinLength = 5,
  onConfirm,
  onClose,
}) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setReason("");
      setTouched(false);
    }
  }, [open]);

  const reasonError = requireReason && reason.trim().length < reasonMinLength;

  const handleConfirm = () => {
    setTouched(true);

    if (reasonError) {
      return;
    }

    onConfirm(requireReason ? reason.trim() : undefined);
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle fontWeight={800}>{title}</DialogTitle>
      <DialogContent>
        {message && <DialogContentText sx={{ mb: requireReason ? 2 : 0 }}>{message}</DialogContentText>}
        {requireReason && (
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            label={reasonLabel}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            onBlur={() => setTouched(true)}
            error={touched && reasonError}
            helperText={touched && reasonError ? `Please write at least ${reasonMinLength} characters.` : " "}
            disabled={loading}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          {cancelText}
        </Button>
        <Button
          variant="contained"
          color={confirmColor}
          onClick={handleConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
