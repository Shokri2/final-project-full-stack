import { Avatar, Box, Button, Card, CardContent, Chip, Container, Rating, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SectionTitle from "../SmartFarming/SectionTitle";
import { useFetch } from "../../Hooks/useFetch";
import { getPublicFeedback } from "../../api/feedbackApi";

function FarmerReviewsSection() {
  const { data, loading, error } = useFetch(() => getPublicFeedback({ limit: 3, sort: "created_at", order: "desc" }), []);
  const reviews = data?.feedback ?? [];

  if (loading || error || reviews.length === 0) {
    return null;
  }

  return (
    <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <SectionTitle
          overline="WHAT FARMERS SAY"
          title="Real reviews from our farmers"
          subtitle="Every review is checked by our team before it is published."
        />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 3 }}>
          {reviews.map((review) => (
            <Card key={review.id} elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 4, height: "100%" }}>
              <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
                <FormatQuoteRoundedIcon sx={{ fontSize: 40, color: "primary.main", opacity: 0.4 }} />
                <Typography sx={{ lineHeight: 1.8, flex: 1 }}>{review.comment}</Typography>
                <Rating value={review.rating} readOnly size="small" />
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>{review.user_name?.[0]}</Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={700} noWrap>
                      {review.user_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {review.crop_name ? `${review.crop_name} grower` : "AL-HASAD GATE member"}
                    </Typography>
                  </Box>
                </Stack>
                {review.verified_consultation && (
                  <Chip
                    icon={<VerifiedOutlinedIcon />}
                    label="After a consultation"
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ alignSelf: "flex-start" }}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Button component={Link} to="/crop-guide" variant="outlined" size="large">
            See reviews in the crop guide
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default FarmerReviewsSection;
