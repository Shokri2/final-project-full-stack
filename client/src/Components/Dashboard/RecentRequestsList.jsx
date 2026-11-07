import { List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import StatusChip from "../Common/StatusChip";
import { timeAgo } from "../../utils/format";

function RecentRequestsList({ requests = [], basePath, emptyText = "No requests yet.", showFarmer }) {
  if (requests.length === 0) {
    return (
      <Typography color="text.secondary" variant="body2">
        {emptyText}
      </Typography>
    );
  }

  return (
    <List disablePadding>
      {requests.map((request) => (
        <ListItemButton
          key={request.id}
          component={Link}
          to={`${basePath}/${request.id}`}
          sx={{ borderRadius: 2, px: 1.5, gap: 2 }}
        >
          <ListItemText
            primary={request.title}
            secondary={[request.crop_name, showFarmer ? request.user_name : null, timeAgo(request.updated_at ?? request.created_at)]
              .filter(Boolean)
              .join(" · ")}
            slotProps={{ primary: { noWrap: true, fontWeight: 600 } }}
            sx={{ minWidth: 0 }}
          />
          <StatusChip status={request.status} />
        </ListItemButton>
      ))}
    </List>
  );
}

export default RecentRequestsList;
