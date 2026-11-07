import { Chip } from "@mui/material";
import { formatLabel } from "../../utils/format";

const statusColors = {
  pending: "warning",
  assigned: "info",
  in_progress: "secondary",
  answered: "success",
  closed: "default",
  rejected: "error",
  cancelled: "default",
  approved: "success",
  new: "warning",
  read: "info",
  archived: "default",
  active: "success",
  inactive: "error",
  high: "error",
  medium: "warning",
  low: "default",
};

function StatusChip({ status, label, size = "small" }) {
  return (
    <Chip
      size={size}
      label={label ?? formatLabel(status)}
      color={statusColors[status] ?? "default"}
      variant={status === "closed" || status === "cancelled" ? "outlined" : "filled"}
      sx={{ fontWeight: 700 }}
    />
  );
}

export default StatusChip;
