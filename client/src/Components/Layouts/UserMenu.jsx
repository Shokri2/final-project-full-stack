import { useState } from "react";
import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../Hooks/useAuth";
import { ROLE_LABELS } from "../../utils/roles";
import { assetUrl } from "../../api";

function UserMenu({ basePath }) {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [anchor, setAnchor] = useState(null);

  const go = (path) => {
    setAnchor(null);
    navigate(path);
  };

  return (
    <>
      <IconButton onClick={(event) => setAnchor(event.currentTarget)} aria-label="Open account menu">
        <Avatar src={assetUrl(currentUser?.avatar)} sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
          {currentUser?.name?.[0]?.toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <Box sx={{ px: 2, py: 1, maxWidth: 260 }}>
          <Typography fontWeight={700} noWrap>
            {currentUser?.name}
          </Typography>
          <Typography fontSize={13} color="text.secondary" noWrap>
            {currentUser?.email}
          </Typography>
          <Typography fontSize={12} color="primary.main" fontWeight={700}>
            {ROLE_LABELS[currentUser?.role]}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => go(`${basePath}/profile`)}>
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => go(`${basePath}/change-password`)}>
          <ListItemIcon>
            <LockResetOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setAnchor(null);
            logout();
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default UserMenu;
