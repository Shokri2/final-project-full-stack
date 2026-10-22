import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleIcon from "@mui/icons-material/People";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";

function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "0",
      icon: <PeopleIcon />,
    },
    {
      title: "Registered Plants",
      value: "0",
      icon: <SpaOutlinedIcon />,
    },
    {
      title: "Connected Devices",
      value: "0",
      icon: <SensorsOutlinedIcon />,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 5 }}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <DashboardOutlinedIcon sx={{ fontSize: 35, color: "success.main" }} />
          <Typography variant="h4" fontWeight={800}>
            Admin Dashboard
          </Typography>
        </Box>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Manage users, plants, and smart devices from one place.
        </Typography>

        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stat.title}>
              <Card
                sx={{
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
                      color: "success.main",
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                    <Typography color="text.secondary">{stat.title}</Typography>
                  </Box>

                  <Typography variant="h4" fontWeight={800}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default AdminDashboard;
