import {
  Box,
  Container,
  Typography,
  Stack,
} from "@mui/material";

import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ContactForm from "../Contact/ContactForm";

export default function ContactUs() {
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
            sx={{
              p: { xs: 2.5, sm: 4, md: 5 },
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: { xs: "20px", md: "26px" },
              boxShadow: "0 18px 45px rgba(20, 39, 23, 0.2)",
            }}
          >
            <ContactForm />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
