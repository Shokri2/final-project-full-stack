import { Box, Button, Chip, Container, Rating, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DEFAULT_CROP_IMAGE, getCropImage } from "../../utils/cropImages";

function CropHero({ crop, action, backTo, sx }) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        minHeight: { xs: 340, md: 480 },
        display: "flex",
        color: "#fff",
        ...sx,
      }}
    >
      <Box
        component="img"
        src={getCropImage(crop)}
        alt={crop.name}
        onError={(event) => {
          event.currentTarget.src = DEFAULT_CROP_IMAGE;
        }}
        sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(8,20,12,0.55) 0%, rgba(8,20,12,0.05) 35%, rgba(8,20,12,0.85) 100%)",
        }}
      />
      <Container
        maxWidth="lg"
        sx={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", py: { xs: 2.5, md: 4 } }}
      >
        {backTo ? (
          <Box>
            <Button component={Link} to={backTo} startIcon={<ArrowBackIcon />} sx={{ color: "#fff", bgcolor: "rgba(0,0,0,0.25)", backdropFilter: "blur(6px)" }}>
              All crops
            </Button>
          </Box>
        ) : (
          <span />
        )}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: { md: "flex-end" }, mt: 6 }}
        >
          <Box>
            <Chip label={crop.category_name} size="small" sx={{ bgcolor: "#D9F36A", color: "#183D2A", mb: 1.5 }} />
            <Typography component="h1" sx={{ fontWeight: 900, fontSize: { xs: 38, md: 64 }, lineHeight: 1.05 }}>
              {crop.name}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 1 }}>
              <Rating
                value={Number(crop.average_rating) || 0}
                precision={0.5}
                readOnly
                size="small"
                sx={{ "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.45)" } }}
              />
              <Typography sx={{ opacity: 0.9 }}>
                {crop.reviews_count > 0 ? `${crop.average_rating} · ${crop.reviews_count} reviews` : "No reviews yet"}
              </Typography>
            </Stack>
          </Box>
          {action}
        </Stack>
      </Container>
    </Box>
  );
}

export default CropHero;
