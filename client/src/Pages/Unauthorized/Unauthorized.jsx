import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../../Hooks/useAuth";
import { getRoleHome } from "../../utils/roles";

function Unauthorized() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "background.default", py: 6 }}>
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <LockOutlinedIcon sx={{ fontSize: 72, color: "warning.main" }} />
        <Typography variant="h3" fontWeight={800} sx={{ mt: 2 }}>
          Access denied
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2, mb: 4 }}>
          You don't have permission to open this page. If you think this is a mistake, contact the administrator.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "center" }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <Button variant="contained" component={Link} to={currentUser ? getRoleHome(currentUser) : "/login"}>
            {currentUser ? "Go to my dashboard" : "Log in"}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default Unauthorized;
