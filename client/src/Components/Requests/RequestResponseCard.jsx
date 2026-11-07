import { Alert, AlertTitle, Paper, Stack, Typography } from "@mui/material";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

function RequestResponseCard({ request }) {
  if (request.status === "rejected" && request.rejection_reason) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        <AlertTitle>Request rejected</AlertTitle>
        {request.rejection_reason}
      </Alert>
    );
  }

  if (!request.agronomist_response) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, borderRadius: 3, border: 2, borderColor: "success.main", bgcolor: "action.hover" }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5, color: "success.main" }}>
        <SupportAgentOutlinedIcon />
        <Typography fontWeight={800}>Agronomist's answer</Typography>
      </Stack>
      <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{request.agronomist_response}</Typography>
      {request.agronomist && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          — {request.agronomist.name}
        </Typography>
      )}
    </Paper>
  );
}

export default RequestResponseCard;
