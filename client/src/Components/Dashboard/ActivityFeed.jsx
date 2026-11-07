import { Avatar, Box, Stack, Typography } from "@mui/material";
import { formatLabel, timeAgo } from "../../utils/format";
import { ROLE_LABELS } from "../../utils/roles";

function ActivityFeed({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No activity yet.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.75}>
      {activities.map((activity) => (
        <Stack key={activity.id} direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
          <Avatar sx={{ width: 30, height: 30, fontSize: 13, bgcolor: "primary.main" }}>
            {activity.user_name?.[0] ?? "S"}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2">
              <strong>{activity.user_name ?? "System"}</strong>{" "}
              {formatLabel(activity.action).toLowerCase()}
              {activity.entity_id ? ` #${activity.entity_id}` : ""}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {activity.user_role ? `${ROLE_LABELS[activity.user_role]} · ` : ""}
              {timeAgo(activity.created_at)}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}

export default ActivityFeed;
