import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";

function Services() {
  const navigate = useNavigate();

  const services = [
    {
      icon: <SpaOutlinedIcon sx={{ fontSize: 42 }} />,
      title: "Plant Management",
      description:
        "Organize your plants and keep their information accessible in one place.",
    },
    {
      icon: <WaterDropOutlinedIcon sx={{ fontSize: 42 }} />,
      title: "Smart Irrigation",
      description:
        "Manage watering and support more efficient use of water for your plants.",
    },
    {
      icon: <SensorsOutlinedIcon sx={{ fontSize: 42 }} />,
      title: "Device Monitoring",
      description:
        "View connected device information and monitor available sensor readings.",
    },
    {
      icon: <MonitorHeartOutlinedIcon sx={{ fontSize: 42 }} />,
      title: "Plant Health Tracking",
      description:
        "Follow plant conditions and use available data to support better care.",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7FAF5", py: 8 }}>
      <Container maxWidth="lg">
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography
            variant="overline"
            sx={{ color: "#388E3C", fontWeight: 800, letterSpacing: 2 }}
          >
            OUR SERVICES
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#183D2A",
              mt: 1,
              mb: 2,
              fontSize: { xs: "2rem", md: "2.8rem" },
            }}
          >
            Smart Solutions for Your Plants
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ maxWidth: 650, mx: "auto", lineHeight: 1.8 }}
          >
            Explore GreenBot features designed to help you manage plant care,
            monitor conditions, and organize irrigation.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={service.title}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  border: "1px solid #E5EDE4",
                  boxShadow: "none",
                  transition: "0.25s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 16px 35px rgba(25,77,44,0.08)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ color: "#388E3C", mb: 2 }}>{service.icon}</Box>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ mb: 1.5, color: "#183D2A" }}
                  >
                    {service.title}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{ lineHeight: 1.8, mb: 2 }}
                  >
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            Ready to get started?
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/register")}
            sx={{
              bgcolor: "#246B3D",
              borderRadius: 2,
              px: 4,
              py: 1.4,
              textTransform: "none",
              "&:hover": { bgcolor: "#194D2C" },
            }}
          >
            Create Your Account
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Services;
