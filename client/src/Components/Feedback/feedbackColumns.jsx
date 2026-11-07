import { Box, IconButton, Rating, Stack, Tooltip, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import StatusChip from "../Common/StatusChip";
import { formatDate } from "../../utils/format";

export const feedbackTarget = (row) => {
  if (row.request_title) {
    return `Consultation: ${row.request_title}`;
  }

  return row.crop_name ? `Crop guide: ${row.crop_name}` : "Platform feedback";
};

export const myFeedbackColumns = ({ onEdit, onDelete }) => [
  {
    field: "target",
    headerName: "About",
    render: (row) => (
      <Typography fontWeight={600} sx={{ maxWidth: 260 }} noWrap>
        {feedbackTarget(row)}
      </Typography>
    ),
  },
  {
    field: "rating",
    headerName: "Rating",
    sortField: "rating",
    render: (row) => <Rating value={row.rating} readOnly size="small" />,
  },
  {
    field: "comment",
    headerName: "Comment",
    render: (row) => (
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {row.comment}
      </Typography>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    render: (row) => (
      <Box>
        <StatusChip status={row.status} label={row.status === "approved" ? "Published" : undefined} />
        {row.rejection_reason && (
          <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5, maxWidth: 200 }}>
            {row.rejection_reason}
          </Typography>
        )}
      </Box>
    ),
  },
  {
    field: "created_at",
    headerName: "Date",
    sortField: "created_at",
    render: (row) => formatDate(row.created_at),
  },
  {
    field: "actions",
    headerName: "",
    align: "right",
    render: (row) =>
      row.status === "pending" ? (
        <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end" }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit(row)} aria-label="Edit feedback">
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => onDelete(row)} aria-label="Delete feedback">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ) : null,
  },
];
