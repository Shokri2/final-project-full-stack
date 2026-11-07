import { Box, IconButton, Rating, Stack, Tooltip, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOffOutlined";
import StatusChip from "../Common/StatusChip";
import { feedbackTarget } from "./feedbackColumns";
import { formatDate } from "../../utils/format";

export const moderationColumns = ({ onView, onApprove, onReject }) => [
  {
    field: "user_name",
    headerName: "Author",
    render: (row) => (
      <Box sx={{ minWidth: 0, maxWidth: 200 }}>
        <Typography fontWeight={700} noWrap>
          {row.user_name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {row.user_email}
        </Typography>
      </Box>
    ),
  },
  {
    field: "target",
    headerName: "About",
    render: (row) => (
      <Typography variant="body2" sx={{ maxWidth: 220 }} noWrap>
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
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 300, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
      >
        {row.comment}
      </Typography>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    sortField: "status",
    render: (row) => <StatusChip status={row.status} />,
  },
  {
    field: "created_at",
    headerName: "Submitted",
    sortField: "created_at",
    render: (row) => formatDate(row.created_at),
  },
  {
    field: "actions",
    headerName: "",
    align: "right",
    render: (row) => (
      <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end" }} onClick={(event) => event.stopPropagation()}>
        <Tooltip title="View details">
          <IconButton size="small" onClick={() => onView(row)} aria-label="View feedback details">
            <VisibilityOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {row.status !== "approved" && (
          <Tooltip title="Approve">
            <IconButton size="small" color="success" onClick={() => onApprove(row)} aria-label="Approve feedback">
              <CheckCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {row.status !== "rejected" && (
          <Tooltip title="Reject">
            <IconButton size="small" color="error" onClick={() => onReject(row)} aria-label="Reject feedback">
              <HighlightOffIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    ),
  },
];
