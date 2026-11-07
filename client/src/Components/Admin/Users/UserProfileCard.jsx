import { Avatar, Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { assetUrl } from "../../../api";
import { RoleChip } from "./userColumns";
import { formatDate, formatDateTime } from "../../../utils/format";

function Row({ label, value }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ textAlign: "right", wordBreak: "break-word" }}>
        {value}
      </Typography>
    </Box>
  );
}

function UserProfileCard({ user }) {
  return (
    <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 3 }}>
      <Stack spacing={1.5} sx={{ alignItems: "center", textAlign: "center" }}>
        <Avatar src={assetUrl(user.avatar)} sx={{ width: 80, height: 80, fontSize: 32, bgcolor: "primary.main" }}>
          {user.name?.[0]}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={800}>
            {user.name}
          </Typography>
          <Typography color="text.secondary" sx={{ wordBreak: "break-all" }}>
            {user.email}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", justifyContent: "center" }} useFlexGap>
          <RoleChip role={user.role} />
          <Chip size="small" label={user.is_active ? "Active" : "Inactive"} color={user.is_active ? "success" : "error"} />
          <Chip
            size="small"
            variant="outlined"
            label={user.email_verified ? "Email verified" : "Not verified"}
            color={user.email_verified ? "success" : "warning"}
          />
        </Stack>
      </Stack>
      <Divider sx={{ my: 2.5 }} />
      <Stack spacing={1.25}>
        <Row label="Phone" value={user.phone || "—"} />
        <Row label="Joined" value={formatDate(user.created_at)} />
        <Row label="Last login" value={user.last_login_at ? formatDateTime(user.last_login_at) : "Never"} />
        <Row label="Requests submitted" value={user.submitted_requests} />
        <Row label="Requests assigned" value={user.assigned_requests} />
        <Row label="Feedback written" value={user.feedback_count} />
      </Stack>
      {user.role === "agronomist" && (
        <>
          <Divider sx={{ my: 2.5 }} />
          <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
            Specialties
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }} useFlexGap>
            {user.specialties.length === 0 ? (
              <Typography variant="body2" color="warning.main">
                No specialties — this agronomist cannot receive requests.
              </Typography>
            ) : (
              user.specialties.map((specialty) => <Chip key={specialty.id} label={specialty.name} variant="outlined" color="primary" />)
            )}
          </Stack>
        </>
      )}
    </Paper>
  );
}

export default UserProfileCard;
