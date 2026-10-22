import { Box, Container, Typography } from "@mui/material";

import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import DeviceThermostatOutlinedIcon from "@mui/icons-material/DeviceThermostatOutlined";
import GrassOutlinedIcon from "@mui/icons-material/GrassOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";

const features = [
  {
    icon: SensorsOutlinedIcon,
    title: "Smart Sensors",
    description:
      "Collect environmental data to better understand farm conditions",
  },
  {
    icon: WaterDropOutlinedIcon,
    title: "Water Management",
    description:
      "Support efficient irrigation and help reduce unnecessary water use",
  },
  {
    icon: DeviceThermostatOutlinedIcon,
    title: "Climate Monitoring",
    description:
      "Monitor soil temperature, moisture, air temperature, and humidity",
  },
  {
    icon: GrassOutlinedIcon,
    title: "Soil Analysis",
    description:
      "Understand soil conditions and support informed farming decisions",
  },
  {
    icon: ScienceOutlinedIcon,
    title: "Soil Quality",
    description:
      "Track important soil indicators such as pH and electrical conductivity",
  },
  {
    icon: WbSunnyOutlinedIcon,
    title: "Light Monitoring",
    description:
      "Understand light conditions to support better crop management",
  },
];

export default function Features() {
  return (
    <Box
      component="section"
      id="features"
      sx={{
        mt: 0,
        pt: { xs: 8, md: 12 },
        pb: { xs: 8, md: 12 },
        px: 2,
        bgcolor: "#354F38",
        color: "#F7F8F2",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            maxWidth: 820,
            mx: "auto",
            textAlign: "center",
            mb: { xs: 6, md: 9 },
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: {
                xs: 37,
                sm: 50,
                md: 66,
              },
              fontWeight: 700,
              lineHeight: 1.18,
              letterSpacing: { xs: -1, md: -2 },
              mb: 3,
            }}
          >
            The Future of
            <Box
              component="span"
              sx={{
                display: "block",
                color: "#D9F36A",
                fontWeight: 500,
                fontStyle: "italic",
              }}
            >
              Smart Agriculture
            </Box>
          </Typography>

          <Typography
            sx={{
              maxWidth: 650,
              mx: "auto",
              color: "rgba(247,248,242,0.76)",
              fontSize: { xs: 14, md: 16 },
              lineHeight: 2,
            }}
          >
            Explore a smarter approach to farming through intelligent
            monitoring, soil analysis and more efficient agricultural resource
            management
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
            columnGap: { xs: 3, md: 6 },
            rowGap: { xs: 5, md: 7 },
            maxWidth: 1050,
            mx: "auto",
          }}
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Box
                key={feature.title}
                sx={{
                  textAlign: "center",
                  px: { xs: 2, md: 1 },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    mx: "auto",
                    mb: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#D9F36A",
                    transition: "transform 0.3s ease",

                    "& svg": {
                      fontSize: 37,
                      strokeWidth: 1.4,
                    },

                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Icon />
                </Box>

                <Typography
                  component="h3"
                  sx={{
                    color: "#FFFFFF",
                    fontSize: { xs: 18, md: 20 },
                    fontWeight: 700,
                    mb: 1.5,
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  sx={{
                    color: "rgba(247,248,242,0.7)",
                    fontSize: 14,
                    lineHeight: 1.9,
                    maxWidth: 290,
                    mx: "auto",
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
