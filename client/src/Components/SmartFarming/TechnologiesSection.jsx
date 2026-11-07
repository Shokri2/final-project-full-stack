import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import SatelliteAltOutlinedIcon from "@mui/icons-material/SatelliteAltOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import SectionTitle from "./SectionTitle";

const technologies = [
  {
    icon: <SensorsOutlinedIcon />,
    title: "Soil & climate sensors",
    text: "Measure soil moisture, temperature and humidity around the clock, so you know what the plant feels.",
  },
  {
    icon: <WaterDropOutlinedIcon />,
    title: "Smart irrigation",
    text: "Water only when and where it is needed. Drip lines and timers follow sensor readings, not guesswork.",
  },
  {
    icon: <SatelliteAltOutlinedIcon />,
    title: "Crop monitoring",
    text: "Cameras and drone or satellite images reveal stress, pests and disease early, before they spread.",
  },
  {
    icon: <InsightsOutlinedIcon />,
    title: "Data & analytics",
    text: "Records of every season show what worked, helping you plan planting dates, inputs and harvests.",
  },
  {
    icon: <PrecisionManufacturingOutlinedIcon />,
    title: "Automation & robotics",
    text: "Machines handle repetitive work like seeding, spraying and weeding with precision.",
  },
  {
    icon: <CloudOutlinedIcon />,
    title: "Weather intelligence",
    text: "Forecasts warn you about frost, heat waves and rain, so you can protect crops in time.",
  },
];

function TechnologiesSection() {
  return (
    <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
      <Container maxWidth="lg">
        <SectionTitle
          overline="THE TECHNOLOGY"
          title="What makes a farm smart?"
          subtitle="Smart farming combines a few simple tools. You don't need all of them on day one."
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          {technologies.map((item) => (
            <Card
              key={item.title}
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 4,
                transition: "transform 0.25s, box-shadow 0.25s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: "0 16px 36px rgba(24,61,42,0.12)" },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 3,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="h6" fontWeight={800}>
                  {item.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
                  {item.text}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default TechnologiesSection;
