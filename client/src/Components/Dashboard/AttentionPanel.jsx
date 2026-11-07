import { Box, Chip, List, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { timeAgo } from "../../utils/format";

const items = [
  { key: "overdue_pending_requests", label: "Requests waiting over 48h", to: "/admin/requests?status=pending&sort=created_at&order=asc" },
  { key: "pending_feedback", label: "Feedback to review", to: "/admin/feedback" },
  { key: "new_contact_messages", label: "New contact messages", to: "/admin/messages?status=new" },
  { key: "crops_without_specialist", label: "Active crops without a specialist", to: "/admin/users?role=agronomist" },
];

function AttentionPanel({ attention }) {
  return (
    <Box>
      <Stack spacing={1}>
        {items.map((item) => (
          <ListItemButton
            key={item.key}
            component={Link}
            to={item.to}
            sx={{ borderRadius: 2, border: 1, borderColor: "divider", justifyContent: "space-between" }}
          >
            <Typography variant="body2" fontWeight={600}>
              {item.label}
            </Typography>
            <Chip size="small" label={attention[item.key]} color={attention[item.key] > 0 ? "warning" : "default"} />
          </ListItemButton>
        ))}
      </Stack>

      {attention.oldest_pending_requests.length > 0 && (
        <>
          <Typography variant="subtitle2" fontWeight={800} sx={{ mt: 2.5, mb: 0.5 }}>
            Oldest unassigned requests
          </Typography>
          <List dense disablePadding>
            {attention.oldest_pending_requests.map((request) => (
              <ListItemButton key={request.id} component={Link} to={`/admin/requests/${request.id}`} sx={{ borderRadius: 1 }}>
                <ListItemText
                  primary={request.title}
                  secondary={`${request.crop_name} · ${request.user_name} · ${timeAgo(request.created_at)}`}
                  slotProps={{ primary: { noWrap: true } }}
                />
              </ListItemButton>
            ))}
          </List>
        </>
      )}
    </Box>
  );
}

export default AttentionPanel;
