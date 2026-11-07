import { useCallback, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  LinearProgress,
  Pagination,
  Paper,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import LoadingState from "../Common/LoadingState";
import ErrorState from "../Common/ErrorState";
import EmptyState from "../Common/EmptyState";
import { useFetch } from "../../Hooks/useFetch";
import { getPublicFeedback } from "../../api/feedbackApi";
import { timeAgo } from "../../utils/format";

const starRows = [
  ["five", 5],
  ["four", 4],
  ["three", 3],
  ["two", 2],
  ["one", 1],
];

function RatingSummary({ summary }) {
  return (
    <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 3 }}>
      <Typography sx={{ fontSize: 44, fontWeight: 900, lineHeight: 1 }}>
        {summary.average_rating ?? "–"}
      </Typography>
      <Rating value={Number(summary.average_rating) || 0} precision={0.5} readOnly />
      <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
        {summary.reviews_count} approved reviews
      </Typography>
      <Stack spacing={0.75}>
        {starRows.map(([key, stars]) => (
          <Stack key={key} direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography variant="body2" sx={{ width: 14 }}>
              {stars}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={summary.reviews_count ? (summary[key] / summary.reviews_count) * 100 : 0}
              sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: "action.selected" }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ width: 20, textAlign: "right" }}>
              {summary[key]}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

function ReviewItem({ review }) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, border: 1, borderColor: "divider", borderRadius: 3 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1 }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>{review.user_name?.[0]}</Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography fontWeight={700} noWrap>
            {review.user_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {timeAgo(review.created_at)}
          </Typography>
        </Box>
        <Rating value={review.rating} readOnly size="small" />
      </Stack>
      <Typography color="text.secondary">{review.comment}</Typography>
      {review.verified_consultation && (
        <Chip
          icon={<VerifiedOutlinedIcon />}
          label="After a consultation"
          size="small"
          color="success"
          variant="outlined"
          sx={{ mt: 1.5 }}
        />
      )}
    </Paper>
  );
}

function CropReviews({ cropId }) {
  const [page, setPage] = useState(1);
  const fetchReviews = useCallback(() => getPublicFeedback({ crop_id: cropId, page, limit: 5 }), [cropId, page]);
  const { data, loading, error, refetch } = useFetch(fetchReviews, [fetchReviews]);

  if (loading && !data) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "280px minmax(0, 1fr)" },
        gap: 3,
        alignItems: "start",
      }}
    >
      <RatingSummary summary={data.summary} />
      <Stack spacing={2}>
        {data.feedback.length === 0 ? (
          <Paper elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3 }}>
            <EmptyState
              icon={<RateReviewOutlinedIcon />}
              title="No reviews yet"
              description="Farmers who follow this guide can share their experience."
            />
          </Paper>
        ) : (
          data.feedback.map((review) => <ReviewItem key={review.id} review={review} />)
        )}
        {data.pagination.totalPages > 1 && (
          <Pagination
            count={data.pagination.totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            sx={{ alignSelf: "center" }}
          />
        )}
      </Stack>
    </Box>
  );
}

export default CropReviews;
