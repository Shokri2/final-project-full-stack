import { Box, Paper, Stack, Typography } from "@mui/material";
import StatusChip from "../Common/StatusChip";
import { formatDateTime } from "../../utils/format";
import { ROLE_LABELS } from "../../utils/roles";

function RequestTimeline({ history = [] }) {
  return (
    <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
        Status history
      </Typography>
      <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0 }}>
        {[...history].reverse().map((entry, index, list) => (
          <Box component="li" key={entry.id} sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  mt: 0.75,
                  borderRadius: "50%",
                  bgcolor: index === 0 ? "primary.main" : "divider",
                  flexShrink: 0,
                }}
              />
              {index < list.length - 1 && <Box sx={{ width: 2, flex: 1, bgcolor: "divider", my: 0.5 }} />}
            </Box>
            <Box sx={{ pb: 2.5, minWidth: 0 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }} useFlexGap>
                <StatusChip status={entry.to_status} />
                <Typography variant="caption" color="text.secondary">
                  {formatDateTime(entry.created_at)}
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ mt: 0.75 }}>
                by <strong>{entry.changed_by?.name ?? "System"}</strong>
                {entry.changed_by?.role ? ` (${ROLE_LABELS[entry.changed_by.role]})` : ""}
              </Typography>
              {entry.note && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, wordBreak: "break-word" }}>
                  {entry.note}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default RequestTimeline;
