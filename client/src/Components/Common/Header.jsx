import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { NavLink, Link } from "react-router-dom";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../Hooks/useAuth";
import { getRoleHome } from "../../utils/roles";

const pages = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
  { title: "Crop Guide", path: "/crop-guide" },
  { title: "Reviews", path: "/feedback" },
  { title: "Contact", path: "/contact" },
];

const lightButton = {
  color: "#fff",
  textTransform: "none",
  fontWeight: 700,
  "&:hover": {
    color: "#D9F36A",
  },
};

function Header() {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

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
                width: { xs: 48, sm: 60 },
                height: { xs: 48, sm: 60 },
                objectFit: "cover",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            />

            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: 17, letterSpacing: 1.2, lineHeight: 1.2 }}>
                AL-HASAD
              </Typography>
              <Typography sx={{ color: "#D9F36A", fontSize: 11, fontWeight: 800, letterSpacing: 4, mt: 0.4 }}>
                GATE
              </Typography>
            </Box>
          </Box>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              display: { xs: "none", lg: "flex" },
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
                end
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

          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", display: { xs: "none", lg: "flex" } }}>
            {currentUser ? (
              <>
                <Button component={Link} to={getRoleHome(currentUser)} sx={lightButton}>
                  Dashboard
                </Button>
                <Button onClick={logout} sx={lightButton}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" sx={lightButton}>
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

          <IconButton
            onClick={() => setMenuOpen(true)}
            sx={{ display: { xs: "inline-flex", lg: "none" }, color: "#fff" }}
            aria-label="Open menu"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={menuOpen} onClose={closeMenu}>
        <Box sx={{ width: 270 }} role="navigation" aria-label="Main navigation">
          <List>
            {pages.map((page) => (
              <ListItemButton key={page.path} component={NavLink} to={page.path} end onClick={closeMenu}>
                <ListItemText primary={page.title} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <List>
            {currentUser ? (
              <>
                <ListItemButton component={Link} to={getRoleHome(currentUser)} onClick={closeMenu}>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                >
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </>
            ) : (
              <>
                <ListItemButton component={Link} to="/login" onClick={closeMenu}>
                  <ListItemText primary="Login" />
                </ListItemButton>
                <ListItemButton component={Link} to="/register" onClick={closeMenu}>
                  <ListItemText primary="Register" />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default Header;
