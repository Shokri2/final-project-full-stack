import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import { useAuth } from "../../Hooks/useAuth";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8 || formData.password.length > 100) {
      setErrorMessage("Password must be between 8 and 100 characters.");
      return;
    }

    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: "user",
    };

    setLoading(true);

    try {
      console.log("Sending registration request...");

      const result = await register(userData);

      console.log("Registration result:", result);

      setSuccessMessage("Registration request completed successfully.");
    } catch (error) {
      console.error("Registration failed:", error);

      const serverErrors = error?.response?.data?.error;

      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        setErrorMessage(serverErrors.map((item) => item.message).join(" "));
      } else {
        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            "Registration failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
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

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

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
                inputProps={{
                  minLength: 8,
                  maxLength: 100,
                }}
                helperText="Use 8–100 characters and meet the server's password requirements."
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
                inputProps={{
                  minLength: 8,
                  maxLength: 100,
                }}
                fullWidth
                required
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.4,
                  bgcolor: "#246B3D",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": {
                    bgcolor: "#194D2C",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#A5B9A8",
                    color: "#fff",
                  },
                }}
              >
                {loading ? "Creating Account..." : "Create Account"}
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
            <Link
              to="/"
              style={{
                color: "#526357",
                textDecoration: "none",
              }}
            >
              Back to Home
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
