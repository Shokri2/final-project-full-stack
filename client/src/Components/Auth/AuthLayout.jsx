import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ThemeToggle from "../Common/ThemeToggle";

function AuthLayout({ title, subtitle, children, footer, maxWidth = "sm" }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        py: { xs: 3, sm: 5 },
      }}
    >
      <Container maxWidth={maxWidth} sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button component={Link} to="/" startIcon={<ArrowBackIcon />} color="inherit">
          Back to website
        </Button>
        <ThemeToggle />
      </Container>

      <Container maxWidth={maxWidth} sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            component={Link}
            to="/"
            sx={{ display: "inline-flex", alignItems: "center", gap: 1.2, textDecoration: "none", color: "inherit" }}
          >
            <Box
              component="img"
              src="/images/logo.png"
              alt="AL-HASAD GATE logo"
              sx={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }}
            />
            <Box sx={{ textAlign: "left" }}>
              <Typography sx={{ fontWeight: 900, fontSize: 20, letterSpacing: 1.2, lineHeight: 1.1 }}>
                AL-HASAD
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: 12, letterSpacing: 4, color: "primary.main" }}>
                GATE
              </Typography>
            </Box>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, border: 1, borderColor: "divider" }}
        >
          <Typography variant="h5" component="h1" fontWeight={800} sx={{ mb: 1 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {subtitle}
            </Typography>
          )}

          {children}

          {footer && <Box sx={{ mt: 3, textAlign: "center" }}>{footer}</Box>}
        </Paper>
      </Container>
    </Box>
  );
}

export default AuthLayout;
