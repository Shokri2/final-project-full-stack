import { Avatar, Box, Card, CardContent, Chip, Divider, Stack, Typography } from "@mui/material";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { assetUrl } from "../../api";
import { ROLE_LABELS } from "../../utils/roles";
import { formatDate, formatDateTime } from "../../utils/format";

function InfoRow({ label, value }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
      <Typography color="text.secondary" fontSize={14}>
        {label}
      </Typography>
      <Typography fontSize={14} fontWeight={600} sx={{ textAlign: "right", wordBreak: "break-word" }}>
        {value}
      </Typography>
    </Box>
  );
}

function ProfileSummaryCard({ user }) {
  return (
    <Card elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3, height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack sx={{ alignItems: "center", textAlign: "center" }} spacing={1.5}>
          <Avatar src={assetUrl(user.avatar)} sx={{ width: 88, height: 88, fontSize: 36, bgcolor: "primary.main" }}>
            {user.name?.[0]?.toUpperCase()}
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
            <Chip label={ROLE_LABELS[user.role]} color="primary" size="small" />
            {user.email_verified && (
              <Chip icon={<VerifiedOutlinedIcon />} label="Email verified" color="success" size="small" variant="outlined" />
            )}
          </Stack>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={1.5}>
          <InfoRow label="Phone" value={user.phone || "Not added"} />
          <InfoRow label="Member since" value={formatDate(user.created_at)} />
          <InfoRow label="Last login" value={formatDateTime(user.last_login_at)} />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ProfileSummaryCard;
