import { useState } from "react";
import { AppBar, Box, Button, Drawer, IconButton, Toolbar, Typography } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";
import ThemeToggle from "../Common/ThemeToggle";
import { navigation } from "./navigation";

const DRAWER_WIDTH = 264;

function DashboardLayout({ role, basePath, title }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const sections = navigation[role];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Box component="aside" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}
        >
          <Sidebar sections={sections} onNavigate={() => setMobileOpen(false)} />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH, borderRight: 1, borderColor: "divider" },
          }}
        >
          <Sidebar sections={sections} />
        </Drawer>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="sticky"
          elevation={0}
          color="inherit"
          sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}
        >
          <Toolbar sx={{ gap: 1 }}>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: "none" } }}
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography fontWeight={800} sx={{ flex: 1 }} noWrap>
              {title}
            </Typography>
            <Button
              component={Link}
              to="/"
              startIcon={<HomeOutlinedIcon />}
              color="inherit"
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              Website
            </Button>
            <ThemeToggle />
            <UserMenu basePath={basePath} />
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 3 }, maxWidth: 1400, width: "100%", mx: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;
