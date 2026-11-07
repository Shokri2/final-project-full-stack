import { Box, Paper, Typography } from "@mui/material";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import ThermostatOutlinedIcon from "@mui/icons-material/ThermostatOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";

function InfoTile({ icon, label, value }) {
  return (
    <Paper
      elevation={0}
      sx={{ p: 2.5, borderRadius: 3, border: 1, borderColor: "divider", display: "flex", gap: 2, alignItems: "flex-start" }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2.5,
          display: "grid",
          placeItems: "center",
          bgcolor: "action.hover",
          color: "primary.main",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {label}
        </Typography>
        <Typography fontWeight={700} sx={{ mt: 0.25 }}>
          {value || "Not specified"}
        </Typography>
      </Box>
    </Paper>
  );
}

function CropInfoGrid({ crop }) {
  const temperature =
    crop.temperature_min != null && crop.temperature_max != null
      ? `${Number(crop.temperature_min)}°C – ${Number(crop.temperature_max)}°C`
      : null;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
        gap: 2,
      }}
    >
      <InfoTile icon={<ScheduleOutlinedIcon />} label="Time to harvest" value={crop.growth_duration_days && `${crop.growth_duration_days} days`} />
      <InfoTile icon={<ThermostatOutlinedIcon />} label="Ideal temperature" value={temperature} />
      <InfoTile icon={<WbSunnyOutlinedIcon />} label="Sunlight" value={crop.sunlight} />
      <InfoTile icon={<WaterDropOutlinedIcon />} label="Water needs" value={crop.water_needs} />
      <InfoTile icon={<LayersOutlinedIcon />} label="Soil type" value={crop.soil_type} />
    </Box>
  );
}

export default CropInfoGrid;
