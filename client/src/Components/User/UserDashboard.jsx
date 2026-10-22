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
import AddIcon from "@mui/icons-material/Add";

function UserDashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "My Plants",
      value: "0",
      icon: <SpaOutlinedIcon />,
    },
    {
      title: "Irrigation Status",
      value: "Not Connected",
      icon: <WaterDropOutlinedIcon />,
    },
    {
      title: "Connected Devices",
      value: "0",
      icon: <SensorsOutlinedIcon />,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7FAF5", py: 5 }}>
      <Container maxWidth="lg">
        <Typography
          variant="overline"
          sx={{ color: "#388E3C", fontWeight: 800, letterSpacing: 2 }}
        >
          USER WORKSPACE
        </Typography>

        <Typography
          variant="h4"
          fontWeight={800}
          color="#183D2A"
          sx={{ mt: 1, mb: 1 }}
        >
          My Dashboard
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Welcome to your GreenBot workspace. Manage your plants and explore
          your plant care tools.
        </Typography>

        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stat.title}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid #E5EDE4",
                  boxShadow: "none",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#388E3C",
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                    <Typography color="text.secondary">{stat.title}</Typography>
                  </Box>

                  <Typography variant="h5" fontWeight={800} color="#183D2A">
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card
          sx={{
            mt: 4,
            borderRadius: 4,
            border: "1px solid #E5EDE4",
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  Start Your Plant Collection
                </Typography>

                <Typography color="text.secondary">
                  Your plants will appear here when plant management is added.
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/services")}
                sx={{
                  bgcolor: "#246B3D",
                  borderRadius: 2,
                  px: 3,
                  py: 1.2,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#194D2C" },
                }}
              >
                Explore Services
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default UserDashboard;
