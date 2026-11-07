import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { formatLabel } from "../../utils/format";

const colors = {
  pending: "warning",
  assigned: "info",
  in_progress: "secondary",
  answered: "success",
  closed: "primary",
  rejected: "error",
  cancelled: "inherit",
};

function StatusBreakdown({ counts, onSelect }) {
  const statuses = Object.keys(colors);
  const total = counts.total || 1;

  return (
    <Stack spacing={1.5}>
      {statuses.map((status) => (
        <Box
          key={status}
          onClick={onSelect ? () => onSelect(status) : undefined}
          sx={{ cursor: onSelect ? "pointer" : "default", borderRadius: 1, "&:hover": onSelect ? { bgcolor: "action.hover" } : {} }}
        >
          <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" fontWeight={600}>
              {formatLabel(status)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {counts[status]} · {Math.round((counts[status] / total) * 100)}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={(counts[status] / total) * 100}
            color={colors[status]}
            sx={{ height: 8, borderRadius: 4, bgcolor: "action.hover" }}
          />
        </Box>
      ))}
    </Stack>
  );
}

export default StatusBreakdown;
