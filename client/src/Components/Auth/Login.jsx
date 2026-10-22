import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // سنربط تسجيل الدخول بالـ Backend لاحقًا
    console.log("Login form:", formData);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "#F7FAF5",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box textAlign="center" sx={{ mb: 3 }}>
          <SpaOutlinedIcon sx={{ fontSize: 48, color: "#246B3D" }} />

          <Typography variant="h4" fontWeight={800} color="#183D2A">
            GreenBot
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Welcome back! Sign in to your account.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            border: "1px solid #E5EDE4",
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            Login
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Enter your details to continue.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                autoComplete="email"
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  py: 1.4,
                  bgcolor: "#246B3D",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#194D2C" },
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Box>

          <Typography textAlign="center" sx={{ mt: 3 }} color="text.secondary">
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#246B3D",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Create Account
            </Link>
          </Typography>

          <Button
            fullWidth
            onClick={() => navigate("/")}
            sx={{ mt: 1, color: "#526357", textTransform: "none" }}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
