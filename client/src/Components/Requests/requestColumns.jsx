import { Box, Typography } from "@mui/material";
import StatusChip from "../Common/StatusChip";
import { formatDate, timeAgo } from "../../utils/format";

export const titleColumn = {
  field: "title",
  headerName: "Request",
  render: (row) => (
    <Box sx={{ minWidth: 0, maxWidth: 360 }}>
      <Typography fontWeight={700} noWrap>
        {row.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {row.crop_name}
        {row.attachments_count > 0 ? ` · ${row.attachments_count} photo${row.attachments_count > 1 ? "s" : ""}` : ""}
      </Typography>
    </Box>
  ),
};

export const statusColumn = {
  field: "status",
  headerName: "Status",
  sortField: "status",
  render: (row) => <StatusChip status={row.status} />,
};

export const priorityColumn = {
  field: "priority",
  headerName: "Priority",
  sortField: "priority",
  render: (row) => <StatusChip status={row.priority} />,
};

export const farmerColumn = {
  field: "user_name",
  headerName: "Farmer",
};

export const agronomistColumn = {
  field: "agronomist_name",
  headerName: "Agronomist",
  render: (row) => row.agronomist_name ?? <Typography color="text.secondary" variant="body2">Not assigned</Typography>,
};

export const createdColumn = {
  field: "created_at",
  headerName: "Submitted",
  sortField: "created_at",
  render: (row) => formatDate(row.created_at),
};

export const updatedColumn = {
  field: "updated_at",
  headerName: "Last update",
  sortField: "updated_at",
  render: (row) => timeAgo(row.updated_at),
};
