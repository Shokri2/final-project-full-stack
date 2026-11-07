import { Box, Button, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return (
    <Box
      role="alert"
      sx={{
        py: 6,
        px: 2,
        textAlign: "center",
        border: "1px dashed",
        borderColor: "error.light",
        borderRadius: 3,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 48, color: "error.main", mb: 1 }} />
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>
      {message && (
        <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          {message}
        </Typography>
      )}
      {onRetry && (
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onRetry}>
          Try again
        </Button>
      )}
    </Box>
  );
}

export default ErrorState;
