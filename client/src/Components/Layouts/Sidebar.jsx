import { Box, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";

function Sidebar({ sections, onNavigate }) {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        component={Link}
        to="/"
        sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 2.5, py: 2.2, textDecoration: "none", color: "inherit" }}
      >
        <Box
          component="img"
          src="/images/logo.png"
          alt="AL-HASAD GATE logo"
          sx={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover" }}
        />
        <Box>
          <Typography fontWeight={900} sx={{ lineHeight: 1.1, letterSpacing: 1 }}>
            AL-HASAD
          </Typography>
          <Typography fontSize={11} fontWeight={800} color="primary.main" sx={{ letterSpacing: 4 }}>
            GATE
          </Typography>
        </Box>
      </Box>

      <Box component="nav" aria-label="Dashboard navigation" sx={{ flex: 1, overflowY: "auto", px: 1.5, pb: 2 }}>
        {sections.map((section) => (
          <List
            key={section.title}
            dense
            subheader={
              <ListSubheader disableSticky sx={{ bgcolor: "transparent", fontWeight: 800, lineHeight: "36px" }}>
                {section.title}
              </ListSubheader>
            }
          >
            {section.links.map((link) => (
              <ListItemButton
                key={link.to}
                component={NavLink}
                to={link.to}
                end={link.end}
                onClick={onNavigate}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: "text.secondary",
                  "&.active": {
                    bgcolor: "action.selected",
                    color: "primary.main",
                    fontWeight: 700,
                    "& .MuiListItemIcon-root": { color: "primary.main" },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38 }}>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} slotProps={{ primary: { fontWeight: "inherit" } }} />
              </ListItemButton>
            ))}
          </List>
        ))}
      </Box>
    </Box>
  );
}

export default Sidebar;
