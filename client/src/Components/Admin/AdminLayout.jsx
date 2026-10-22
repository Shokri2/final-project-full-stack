import { Box, Container, Typography } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {
  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: isActive ? "#246B3D" : "#526357",
    fontWeight: isActive ? 700 : 500,
    padding: "10px 14px",
    borderRadius: "8px",
    backgroundColor: isActive ? "#E4F3E5" : "transparent",
    display: "block",
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7FAF5" }}>
      <Box
        component="header"
        sx={{
          bgcolor: "#FFFFFF",
          borderBottom: "1px solid #E5EDE4",
          py: 2,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DashboardOutlinedIcon sx={{ color: "#246B3D", fontSize: 30 }} />
            <Typography variant="h5" fontWeight={800} color="#183D2A">
              GreenBot Admin
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <NavLink to="/admin/dashboard" style={linkStyle}>
              Dashboard
            </NavLink>

            <NavLink to="/" style={linkStyle}>
              View Website
            </NavLink>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default AdminLayout;
