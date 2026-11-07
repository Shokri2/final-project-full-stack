import { Avatar, Box, Chip, Container, Rating, Stack, Typography } from "@mui/material";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { useFetch } from "../../Hooks/useFetch";
import { getPublicFeedback } from "../../api/feedbackApi";

const LIME = "#D9F36A";

function ReviewCard({ review }) {
  return (
    <Box
      sx={{
        flex: { xs: "1 1 100%", md: "0 1 calc((100% - 48px) / 3)" },
        p: 3.5,
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        bgcolor: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(6px)",
        transition: "transform 0.25s ease, background-color 0.25s ease",
        "&:hover": { transform: "translateY(-6px)", bgcolor: "rgba(255,255,255,0.1)" },
      }}
    >
      <FormatQuoteRoundedIcon sx={{ fontSize: 44, color: LIME }} />
      <Typography sx={{ color: "#F0F5F0", lineHeight: 1.8, fontSize: 17, flex: 1 }}>{review.comment}</Typography>
      <Rating
        value={review.rating}
        readOnly
        size="small"
        sx={{ "& .MuiRating-iconFilled": { color: LIME }, "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.3)" } }}
      />
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", pt: 2, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        <Avatar sx={{ bgcolor: LIME, color: "#183D2A", fontWeight: 800 }}>{review.user_name?.[0]}</Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography fontWeight={700} sx={{ color: "#fff" }} noWrap>
            {review.user_name}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)" }} noWrap>
            {review.crop_name ? `${review.crop_name} grower` : "AL-HASAD GATE member"}
          </Typography>
        </Box>
        {review.verified_consultation && (
          <Chip
            icon={<VerifiedOutlinedIcon sx={{ color: `${LIME} !important` }} />}
            label="Consulted"
            size="small"
            sx={{ color: LIME, borderColor: "rgba(217,243,106,0.5)" }}
            variant="outlined"
          />
        )}
      </Stack>
    </Box>
  );
}

function FarmerReviewsSection() {
  const { data, loading, error } = useFetch(() => getPublicFeedback({ limit: 3, sort: "created_at", order: "desc" }), []);
  const reviews = data?.feedback ?? [];

  if (loading || error || reviews.length === 0) {
    return null;
  }

  return (
    <Box
      component="section"
      sx={{ py: { xs: 8, md: 11 }, background: "linear-gradient(180deg, #354F38 0%, #1B3321 100%)" }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", maxWidth: 720, mx: "auto", mb: 6 }}>
          <Typography sx={{ color: LIME, fontWeight: 800, letterSpacing: 4, fontSize: 13 }}>WHAT FARMERS SAY</Typography>
          <Typography component="h2" sx={{ color: "#fff", fontWeight: 900, fontSize: { xs: 30, md: 42 }, mt: 1.5 }}>
            Real reviews from{" "}
            <Box component="span" sx={{ color: LIME, fontStyle: "italic", fontWeight: 400 }}>
              our farmers
            </Box>
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.75)", mt: 1.5, fontSize: 17 }}>
            Every review is checked by our team before it is published.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3 }}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </Box>

      </Container>
    </Box>
  );
}

export default FarmerReviewsSection;
