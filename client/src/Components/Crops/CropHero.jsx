import { Box, Chip, Rating, Stack, Typography } from "@mui/material";
import { DEFAULT_CROP_IMAGE, getCropImage } from "../../utils/cropImages";

function CropHero({ crop, action }) {
  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 5,
        overflow: "hidden",
        minHeight: { xs: 260, md: 340 },
        display: "flex",
        alignItems: "flex-end",
        color: "#fff",
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
          background: "linear-gradient(180deg, rgba(8,20,12,0.05) 20%, rgba(8,20,12,0.85) 100%)",
        }}
      />
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ position: "relative", p: { xs: 3, md: 5 }, width: "100%", justifyContent: "space-between", alignItems: { md: "flex-end" } }}
      >
        <Box>
          <Chip label={crop.category_name} size="small" sx={{ bgcolor: "#D9F36A", color: "#183D2A", mb: 1.5 }} />
          <Typography component="h1" sx={{ fontWeight: 900, fontSize: { xs: 34, md: 52 }, lineHeight: 1.05 }}>
            {crop.name}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 1 }}>
            <Rating
              value={Number(crop.average_rating) || 0}
              precision={0.5}
              readOnly
              size="small"
              sx={{ "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.4)" } }}
            />
            <Typography sx={{ opacity: 0.9 }}>
              {crop.reviews_count > 0 ? `${crop.average_rating} · ${crop.reviews_count} reviews` : "No reviews yet"}
            </Typography>
          </Stack>
        </Box>
        {action}
      </Stack>
    </Box>
  );
}

export default CropHero;
