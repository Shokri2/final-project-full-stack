import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Typography } from "@mui/material";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import StatusChip from "../../Common/StatusChip";
import { formatDateTime } from "../../../utils/format";

function MessageDialog({ message, onClose, onArchive, onDelete }) {
  return (
    <Dialog open={Boolean(message)} onClose={onClose} fullWidth maxWidth="sm">
      {message && (
        <>
          <DialogTitle fontWeight={800}>{message.subject}</DialogTitle>
          <DialogContent>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2, flexWrap: "wrap" }} useFlexGap>
              <StatusChip status={message.status} />
              <Typography variant="body2" color="text.secondary">
                {formatDateTime(message.created_at)}
              </Typography>
            </Stack>
            <Typography fontWeight={700}>{message.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-all" }}>
              {message.email}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{message.message}</Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, flexWrap: "wrap", gap: 1 }}>
            <Button color="error" onClick={() => onDelete(message)}>
              Delete
            </Button>
            {message.status !== "archived" && (
              <Button color="inherit" onClick={() => onArchive(message)}>
                Archive
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<ReplyOutlinedIcon />}
              href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
            >
              Reply by email
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default MessageDialog;
