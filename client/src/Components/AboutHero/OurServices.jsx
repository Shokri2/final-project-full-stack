import { Box, Container, Typography } from "@mui/material";
import AgricultureOutlinedIcon from "@mui/icons-material/AgricultureOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";

const services = [
  {
    title: "Smart Irrigation",
    description:
      "Optimize water usage with intelligent irrigation tailored to your crops.",
    icon: WaterDropOutlinedIcon,
  },
  {
    title: "Crop Monitoring",
    description: "Monitor crop health and growth to keep your plants thriving.",
    icon: SpaOutlinedIcon,
  },
  {
    title: "Soil Analysis",
    description:
      "Understand soil conditions and provide crops with what they need.",
    icon: SensorsOutlinedIcon,
  },
  {
    title: "Agricultural Robotics",
    description:
      "Use smart agricultural robots to support efficient farming tasks.",
    icon: SmartToyOutlinedIcon,
  },
  {
    title: "Farm Management",
    description:
      "Manage daily farm activities and make smarter farming decisions.",
    icon: AgricultureOutlinedIcon,
  },
  {
    title: "Data & Insights",
    description:
      "Turn agricultural data into useful insights for better crop yields.",
    icon: AnalyticsOutlinedIcon,
  },
];

export default function OurServices() {
  return (
    <Box
      component="section"
      id="our-services"
      sx={{
        width: "100%",
        py: { xs: 7, md: 11 },
        px: { xs: 2, sm: 3 },
        bgcolor: "#456448",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          component="h2"
          sx={{
            textAlign: "center",
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: { xs: 38, sm: 48, md: 58 },
            fontWeight: 700,
            color: "#cae148",
            mb: { xs: 5, md: 7 },
            lineHeight: 1.2,
          }}
        >
          Our Services
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: { xs: 3, md: 4 },
          }}
        >
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Box
                key={service.title}
                sx={{
                  minHeight: { xs: 245, md: 285 },
                  p: { xs: 3, md: 4 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  bgcolor: "#e2eee0",
                  border: "1px solid #f1e5eb",
                  borderRadius: "18px",
                  boxShadow: "0 5px 20px rgba(50, 35, 42, 0.04)",
                  transition:
                    "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 14px 32px rgba(213, 106, 151, 0.12)",
                    borderColor: "#ece1e5",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 76,
                    height: 76,
                    mb: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    bgcolor: "#dcd7d7",
                    color: "#ada6a9",
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ fontSize: 39 }} />
                </Box>

                <Typography
                  component="h3"
                  sx={{
                    fontSize: { xs: 19, md: 21 },
                    fontWeight: 700,
                    color: "#454243",
                    mb: 1.5,
                    lineHeight: 1.4,
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  sx={{
                    maxWidth: 290,
                    color: "#555555",
                    fontSize: 14,
                    lineHeight: 1.9,
                    fontWeight: 400,
                  }}
                >
                  {service.description}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
