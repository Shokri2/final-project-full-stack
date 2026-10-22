import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";

import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const contactDetails = [
    {
      label: "PHONE",
      value: "+962 7 9000 0000",
      icon: PhoneOutlinedIcon,
    },
    {
      label: "EMAIL",
      value: "alhasadgate@info.com",
      icon: EmailOutlinedIcon,
    },
    {
      label: "ADDRESS",
      value: "Amman, Jordan",
      icon: LocationOnOutlinedIcon,
    },
  ];

  const fieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      bgcolor: "#FFFFFF",
      color: "#263A2A",
      "& fieldset": {
        borderColor: "#DCE5D7",
      },
      "&:hover fieldset": {
        borderColor: "#829B70",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#456448",
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#687568",
      "&.Mui-focused": {
        color: "#456448",
      },
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#929C91",
      opacity: 1,
    },
  };

  return (
    <Box
      component="section"
      id="contact-us"
      sx={{
        width: "100%",
        py: { xs: 7, md: 11 },
        px: { xs: 2, sm: 3 },
        bgcolor: "#456448",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "0.9fr 1.1fr",
            },
            gap: { xs: 5, md: 9 },
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              component="h2"
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: { xs: 40, sm: 48, md: 58 },
                fontWeight: 700,
                color: "#FFFFFF",
                lineHeight: 1.2,
                mb: 2.5,
              }}
            >
              Contact{" "}
              <Box
                component="span"
                sx={{
                  color: "#D9F36A",
                }}
              >
                Us
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.97)",
                fontSize: { xs: 14, sm: 16 },
                lineHeight: 2,
                maxWidth: 440,
                mb: 4,
              }}
            >
              Have questions about smart irrigation crop monitoring or our
              agricultural robot? We are here to help you grow smarter Feel
              free to reach out to us
            </Typography>

            <Stack spacing={3}>
              {contactDetails.map((item) => {
                const Icon = item.icon;

                return (
                  <Box
                    key={item.label}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "15px",
                        bgcolor: "rgba(255,255,255,0.13)",
                        border: "1px solid rgba(255,255,255,0.16)",
                        color: "#D9F36A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon sx={{ fontSize: 24 }} />
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: 1.5,
                          color: "#D9F36A",
                          mb: 0.5,
                        }}
                      >
                        {item.label}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: { xs: 14, sm: 15 },
                          fontWeight: 600,
                          color: "#FFFFFF",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: { xs: 2.5, sm: 4, md: 5 },
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: { xs: "20px", md: "26px" },
              boxShadow: "0 18px 45px rgba(20, 39, 23, 0.2)",
            }}
          >
            <Typography
              component="h3"
              sx={{
                fontSize: { xs: 23, md: 27 },
                fontWeight: 800,
                color: "#f4fbf5",
                mb: 1,
              }}
            >
              Send Us a Message
            </Typography>

            <Typography
              sx={{
                color: "#ffffff",
                fontSize: 14,
                lineHeight: 1.8,
                mb: 3,
              }}
            >
              Let’s grow a smarter future together
            </Typography>

            <Stack spacing={2.5}>
              <TextField
                fullWidth
                required
                name="name"
                label="Your Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                inputProps={{ maxLength: 100 }}
                sx={fieldStyles}
              />

              <TextField
                fullWidth
                required
                name="email"
                type="email"
                label="Your Email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                inputProps={{ maxLength: 254 }}
                sx={fieldStyles}
              />

              <TextField
                fullWidth
                required
                multiline
                minRows={4}
                name="message"
                label="Your Message"
                placeholder="Tell us about your farm or how we can help..."
                value={formData.message}
                onChange={handleChange}
                inputProps={{ maxLength: 2000 }}
                sx={fieldStyles}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  py: 1.7,
                  borderRadius: "12px",
                  bgcolor: "#dee1de",
                  color: "#393838",
                  fontSize: 15,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "none",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    bgcolor: "#dbe1dd",
                    boxShadow: "0 8px 20px rgba(53,79,56,0.2)",
                    transform: "translateY(-2px)",
                  },
                 
                }}
              >
                Send Message
              </Button>

              {submitted && (
                <Typography
                  role="status"
                  sx={{
                    color: "#354F38",
                    bgcolor: "#EAF1E3",
                    borderRadius: "10px",
                    p: 1.5,
                    fontSize: 13,
                    textAlign: "center",
                    lineHeight: 1.8,
                  }}
                >
                  Form validated successfully Connect a backend or email
                  service to send your message
                </Typography>
              )}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
