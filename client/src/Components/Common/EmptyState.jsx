import { Box, Button, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

function EmptyState({ icon, title = "Nothing here yet", description, actionLabel, onAction }) {
  return (
    <Box sx={{ py: 6, px: 2, textAlign: "center" }}>
      <Box sx={{ color: "text.secondary", mb: 1, "& svg": { fontSize: 52 } }}>
        {icon ?? <InboxOutlinedIcon />}
      </Box>
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 420, mx: "auto" }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" sx={{ mt: 3 }} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

export default EmptyState;
