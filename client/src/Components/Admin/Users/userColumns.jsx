import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { assetUrl } from "../../../api";
import { ROLE_LABELS } from "../../../utils/roles";
import { formatDate, timeAgo } from "../../../utils/format";

const roleColors = { admin: "secondary", agronomist: "info", user: "default" };

export const ROLE_OPTIONS = [
  { value: "user", label: "Farmer" },
  { value: "agronomist", label: "Agronomist" },
  { value: "admin", label: "Admin" },
];

export const RoleChip = ({ role }) => <Chip size="small" label={ROLE_LABELS[role]} color={roleColors[role]} />;

export const userColumns = [
  {
    field: "name",
    headerName: "User",
    sortField: "name",
    render: (row) => (
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
        <Avatar src={assetUrl(row.avatar)} sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>
          {row.name?.[0]}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={700} noWrap>
            {row.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {row.email}
          </Typography>
        </Box>
      </Stack>
    ),
  },
  { field: "role", headerName: "Role", sortField: "role", render: (row) => <RoleChip role={row.role} /> },
  {
    field: "is_active",
    headerName: "Status",
    render: (row) => (
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
        <Chip size="small" label={row.is_active ? "Active" : "Inactive"} color={row.is_active ? "success" : "error"} variant="outlined" />
        {row.email_verified && <VerifiedOutlinedIcon fontSize="small" color="success" titleAccess="Email verified" />}
      </Stack>
    ),
  },
  {
    field: "last_login_at",
    headerName: "Last login",
    sortField: "last_login_at",
    render: (row) => (row.last_login_at ? timeAgo(row.last_login_at) : "Never"),
  },
  { field: "created_at", headerName: "Joined", sortField: "created_at", render: (row) => formatDate(row.created_at) },
];
