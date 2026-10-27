import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
  Stack,
} from "@mui/material";

import { NavLink, Link } from "react-router-dom";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useAuth } from "../../Hooks/useAuth";

const pages = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
  { title: "Dashboard", path: "/services" },

  { title: "Crop Guide", path: "/crop-guide" },
];

function Header() {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar
      position="absolute"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        width: "100%",
        bgcolor: "rgba(8, 14, 10, 0.72)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        color: "#fff",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: "82px !important",
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              textDecoration: "none",
              color: "inherit",
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src="/images/logo.png"
              alt="Al-Hasad Gate Logo"
              sx={{
                width: 60,
                height: 60,
                objectFit: "cover",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: 17,
                  letterSpacing: 1.2,
                  lineHeight: 1.2,
                }}
              >
                AL-HASAD
              </Typography>

              <Typography
                sx={{
                  color: "#D9F36A",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 4,
                  mt: 0.4,
                }}
              >
                GATE
              </Typography>
            </Box>
          </Box>

          {/* Navigation Links */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              p: 0.7,
              borderRadius: 50,
              bgcolor: "rgba(255,255,255,0.10)",
              alignItems: "center",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.path}
                component={NavLink}
                to={page.path}
                sx={{
                  color: "#E8ECE7",
                  textTransform: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  px: 2,
                  py: 1.1,
                  borderRadius: 50,
                  whiteSpace: "nowrap",
                  "&.active": {
                    bgcolor: "rgba(255,255,255,0.16)",
                    color: "#D9F36A",
                  },
                  "&:hover": {
                    color: "#D9F36A",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                {page.title}
              </Button>
            ))}
          </Stack>

          {/* Authentication Buttons */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {currentUser ? (
              <Button
                onClick={handleLogout}
                sx={{
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": {
                    color: "#D9F36A",
                  },
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 700,
                    "&:hover": {
                      color: "#D9F36A",
                    },
                  }}
                >
                  Login
                </Button>

                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  endIcon={<ArrowOutwardIcon />}
                  sx={{
                    bgcolor: "#D9F36A",
                    color: "#172514",
                    borderRadius: 50,
                    px: 2.2,
                    py: 1.2,
                    fontWeight: 800,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "#E8FF91",
                      boxShadow: "none",
                    },
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
