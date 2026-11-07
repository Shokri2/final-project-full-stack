import { Box, Link as MuiLink, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import StatusChip from "../Common/StatusChip";
import { timeAgo } from "../../utils/format";

function RequestUpdatesFeed({ updates = [], basePath }) {
  if (updates.length === 0) {
    return (
      <Typography color="text.secondary" variant="body2">
        No updates yet.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {updates.map((update) => (
        <Box key={update.id} sx={{ display: "flex", gap: 1.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main", mt: 1, flexShrink: 0 }} />
          <Box sx={{ minWidth: 0 }}>
            <MuiLink
              component={Link}
              to={`${basePath}/${update.request_id}`}
              underline="hover"
              color="inherit"
              fontWeight={600}
              sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >
              {update.request_title}
            </MuiLink>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 0.5, flexWrap: "wrap" }} useFlexGap>
              <StatusChip status={update.to_status} />
              <Typography variant="caption" color="text.secondary">
                by {update.changed_by_name ?? "System"} · {timeAgo(update.created_at)}
              </Typography>
            </Stack>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

export default RequestUpdatesFeed;
