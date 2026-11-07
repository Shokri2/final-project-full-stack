import { Avatar, Box, Divider, Paper, Stack, Typography } from "@mui/material";
import StatusChip from "../Common/StatusChip";
import { formatDateTime } from "../../utils/format";
import { getCropImage } from "../../utils/cropImages";

function Row({ label, children }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Box sx={{ textAlign: "right", fontWeight: 600, fontSize: 14, wordBreak: "break-word" }}>{children}</Box>
    </Box>
  );
}

function RequestSummaryCard({ request, showFarmer }) {
  return (
    <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 3 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
        <Avatar variant="rounded" src={getCropImage(request.crop)} sx={{ width: 52, height: 52 }} />
        <Box>
          <Typography fontWeight={800}>{request.crop.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {request.crop.category_name}
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={1.25}>
        <Row label="Priority">
          <StatusChip status={request.priority} />
        </Row>
        <Row label="Farm location">{request.farm_location || "—"}</Row>
        <Row label="Field area">{request.field_area_m2 ? `${Number(request.field_area_m2)} m²` : "—"}</Row>
        {showFarmer && <Row label="Farmer">{request.farmer.name}</Row>}
        <Row label="Agronomist">{request.agronomist?.name ?? "Not assigned yet"}</Row>
        <Row label="Submitted">{formatDateTime(request.created_at)}</Row>
        {request.assigned_at && <Row label="Assigned">{formatDateTime(request.assigned_at)}</Row>}
        {request.answered_at && <Row label="Answered">{formatDateTime(request.answered_at)}</Row>}
        {request.closed_at && <Row label="Closed">{formatDateTime(request.closed_at)}</Row>}
      </Stack>
    </Paper>
  );
}

export default RequestSummaryCard;
