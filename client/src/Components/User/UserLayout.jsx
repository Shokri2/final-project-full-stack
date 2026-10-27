import { Box, Container, Typography, Button } from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import { useAuth } from "../../Hooks/useAuth";

function UserLayout() {
  const { logout, currentUser } = useAuth();

  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: isActive ? "#246B3D" : "#526357",
    fontWeight: isActive ? 700 : 500,
    padding: "10px 14px",
    borderRadius: "8px",
    backgroundColor: isActive ? "#E4F3E5" : "transparent",
  });

  // منع عرض لوحة المستخدم إذا لم يكن مسجّل الدخول
  if (!currentUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7FAF5" }}>
      <Box
        component="header"
        sx={{
          bgcolor: "#fff",
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
            <SpaOutlinedIcon sx={{ color: "#246B3D", fontSize: 30 }} />

            <Typography variant="h5" fontWeight={800} color="#183D2A">
              AL-HASAD GATE
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <NavLink to="/user/dashboard" style={linkStyle}>
              Dashboard
            </NavLink>

            <NavLink to="/services" style={linkStyle}>
              Services
            </NavLink>

            <NavLink to="/" style={linkStyle}>
              View Website
            </NavLink>

            <Button
              onClick={handleLogout}
              variant="contained"
              sx={{
                bgcolor: "#246B3D",
                color: "#fff",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                px: 2,
                "&:hover": {
                  bgcolor: "#194D2C",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default UserLayout;
