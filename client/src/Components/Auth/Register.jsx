import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // سنربط إنشاء الحساب بالـ Backend لاحقًا
    console.log("Registration form:", formData);
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
          <SpaOutlinedIcon sx={{ fontSize: 46, color: "#246B3D" }} />

          <Typography variant="h4" fontWeight={800} color="#183D2A">
            GreenBot
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Create your account and start growing smarter.
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
            Create Account
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Enter your details to get started.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                fullWidth
                required
              />

              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                fullWidth
                required
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                inputProps={{ minLength: 8 }}
                helperText="Use at least 8 characters."
                fullWidth
                required
              />

              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                fullWidth
                required
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
                Create Account
              </Button>
            </Stack>
          </Box>

          <Typography textAlign="center" sx={{ mt: 3 }} color="text.secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#246B3D",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
          </Typography>

          <Typography textAlign="center" sx={{ mt: 2 }}>
            <Link to="/" style={{ color: "#526357", textDecoration: "none" }}>
              Back to Home
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
