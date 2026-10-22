
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import AgricultureIcon from "@mui/icons-material/Agriculture";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SpaOutlinedIcon sx={{ fontSize: 36 }} />,
      title: "Plant Management",
      description:
        "Keep your plants organized and access crop information from one place.",
    },
    {
      icon: <WaterDropOutlinedIcon sx={{ fontSize: 36 }} />,
      title: "Smart Irrigation",
      description:
        "Manage irrigation efficiently and help reduce unnecessary water consumption.",
    },
    {
      icon: <SensorsOutlinedIcon sx={{ fontSize: 36 }} />,
      title: "Crop Monitoring",
      description:
        "Explore crop monitoring tools and information from connected agricultural devices.",
    },
  ];

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        bgcolor: "#F7FAF5",
        overflow: "hidden",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 620, sm: 680, md: 720 },
          display: "flex",
          alignItems: "center",
          backgroundImage: "url('/images/greenbot-farm.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          bgcolor: "#183D2A",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(8,25,14,0.78) 0%, rgba(8,25,14,0.38) 65%, rgba(8,25,14,0.12) 100%)",
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              maxWidth: 720,
              pt: { xs: 10, md: 12 },
              pb: { xs: 8, md: 10 },
              color: "#fff",
              textShadow: "0 2px 10px rgba(0,0,0,0.55)",
            }}
          >
            

            <Typography
              component="h1"
              sx={{
                fontSize: {
                  xs: "2.7rem",
                  sm: "4rem",
                  md: "5rem",
                },
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: { xs: "-1px", md: "-1.5px" },
                mb: 3,
                color: "#FFFFFF",
              }}
            >
              Welcome to
              <Box
                component="span"
                sx={{
                  display: "block",
                  color: "#d0ec45",
                }}
              >
                AL-HASAD GATE
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.2rem" },
                lineHeight: 1.9,
                color: "#FFFFFF",
                maxWidth: 620,
                mb: 4,
              }}
            >
              Discover a smarter approach to agriculture. Manage your plants
              explore irrigation solutions and monitor your crops through one
              connected platform
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{ maxWidth: { xs: 320, sm: "none" } }}
            >
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate("/register")}
                sx={{
                  bgcolor: "#D9F36A",
                  color: "#19351E",
                  px: 3.5,
                  py: 1.6,
                  borderRadius: 50,
                  fontWeight: 800,
                  textTransform: "none",
                  textShadow: "none",
                  "&:hover": { bgcolor: "#E8FF91" },
                }}
              >
                Get Started
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate("/services")}
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.8)",
                  px: 3.5,
                  py: 1.6,
                  borderRadius: 50,
                  fontWeight: 700,
                  textTransform: "none",
                  textShadow: "none",
                  "&:hover": {
                    borderColor: "#D9F36A",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Explore Services
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

    </Box>
  );
}
export default Home;

