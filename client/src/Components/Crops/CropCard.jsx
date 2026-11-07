import { Box, Button, Card, CardContent, CardMedia, Chip, Rating, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ThermostatOutlinedIcon from "@mui/icons-material/ThermostatOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { DEFAULT_CROP_IMAGE, getCropImage } from "../../utils/cropImages";

function CropFact({ icon, children }) {
  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", color: "text.secondary" }}>
      {icon}
      <Typography variant="body2" noWrap>
        {children}
      </Typography>
    </Stack>
  );
}

function CropCard({ crop, detailsPath }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        border: 1,
        borderColor: "divider",
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 18px 40px rgba(24,61,42,0.14)",
        },
        "&:hover img": { transform: "scale(1.06)" },
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden", height: 200 }}>
        <CardMedia
          component="img"
          image={getCropImage(crop)}
          alt={crop.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = DEFAULT_CROP_IMAGE;
          }}
          sx={{ height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
        />
        <Chip
          label={crop.category_name}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            bgcolor: "rgba(255,255,255,0.92)",
            color: "#183D2A",
            backdropFilter: "blur(6px)",
          }}
        />
      </Box>

      <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box>
          <Typography variant="h6" fontWeight={800} noWrap>
            {crop.name}
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mt: 0.5 }}>
            <Rating value={Number(crop.average_rating) || 0} precision={0.5} size="small" readOnly />
            <Typography variant="caption" color="text.secondary">
              {crop.reviews_count > 0 ? `${crop.average_rating} (${crop.reviews_count})` : "No reviews yet"}
            </Typography>
          </Stack>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "2.9em" }}
        >
          {crop.description}
        </Typography>

        <Stack spacing={0.75}>
          <CropFact icon={<ThermostatOutlinedIcon fontSize="small" />}>
            {Number(crop.temperature_min)}°C – {Number(crop.temperature_max)}°C
          </CropFact>
          <CropFact icon={<ScheduleOutlinedIcon fontSize="small" />}>
            {crop.growth_duration_days} days to harvest
          </CropFact>
          <CropFact icon={<WbSunnyOutlinedIcon fontSize="small" />}>{crop.sunlight}</CropFact>
        </Stack>

        <Button
          component={Link}
          to={detailsPath(crop)}
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          fullWidth
          sx={{ mt: "auto", py: 1.1, fontWeight: 700 }}
        >
          View Growing Details
        </Button>
      </CardContent>
    </Card>
  );
}

export default CropCard;
