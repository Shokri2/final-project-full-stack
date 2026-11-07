import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";

function NotFound() {
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "background.default", py: 6 }}>
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <SpaOutlinedIcon sx={{ fontSize: 64, color: "primary.main" }} />
        <Typography variant="h1" fontWeight={900} color="primary.main" sx={{ fontSize: { xs: 72, md: 112 } }}>
          404
        </Typography>
        <Typography variant="h5" fontWeight={800}>
          This page didn't grow here
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2, mb: 4 }}>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "center" }}>
          <Button variant="contained" component={Link} to="/">
            Back to home
          </Button>
          <Button variant="outlined" component={Link} to="/crop-guide">
            Browse crops
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default NotFound;
