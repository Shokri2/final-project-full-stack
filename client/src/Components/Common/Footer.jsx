import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  Divider,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const linkStyle = {
    color: "#D1DED5",
    textDecoration: "none",
    fontSize: 14,
    transition: "all 0.3s ease",
    width: "fit-content",
    "&:hover": {
      color: "#D9F36A",
      transform: "translateX(-3px)",
    },
  };

  const headingStyle = {
    color: "#FFFFFF",
    fontWeight: 700,
    mb: 2.5,
    fontSize: 17,
  };

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        background: "linear-gradient(135deg, #111E1B 0%, #293638 100%)",
        color: "#FFFFFF",
        pt: 6,
        pb: 2,
        mt: "auto",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, sm: 4, md: 6, lg: 8 },
        }}
      >
        <Grid
          container
          columnSpacing={{ xs: 3, md: 5, lg: 8 }}
          rowSpacing={4}
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Grid item xs={12} md={4}>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, letterSpacing: 0.5 }}
              >
                AL-HASAD GATE
              </Typography>
            </Stack>

            <Typography
              sx={{
                color: "#D1DED5",
                fontSize: 14,
                lineHeight: 1.9,
                maxWidth: 330,
              }}
            >
              Your smart agriculture partner Monitor crops, manage irrigation,
              and grow a better future with intelligent agricultural technology
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
              <Box
                component="a"
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                sx={{
                  color: "#FFFFFF",
                  display: "flex",
                  p: 1,
                  borderRadius: "8px",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "#D9F36A",
                    color: "#183D2B",
                  },
                }}
              >
                <FacebookIcon />
              </Box>

              <Box
                component="a"
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                sx={{
                  color: "#FFFFFF",
                  display: "flex",
                  p: 1,
                  borderRadius: "8px",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "#D9F36A",
                    color: "#183D2B",
                  },
                }}
              >
                <InstagramIcon />
              </Box>
            </Stack>
          </Grid>

          <Grid
            item
            xs={12}
            md={8}
            sx={{
              ml: "auto",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Grid
              container
              columnSpacing={{ xs: 2, sm: 3, lg: 5 }}
              rowSpacing={4}
              justifyContent="space-between"
              sx={{
                width: "100%",
                maxWidth: 850,
                ml: "auto",
              }}
            >
              <Grid item xs={12} sm={4}>
                <Typography sx={headingStyle}>Quick Links</Typography>

                <Stack spacing={1.5}>
                  <Link component={RouterLink} to="/" sx={linkStyle}>
                    Home
                  </Link>

                  <Link component={RouterLink} to="/about" sx={linkStyle}>
                    About Us
                  </Link>

                  <Link component={RouterLink} to="/services" sx={linkStyle}>
                    Our Services
                  </Link>

                  <Link component={RouterLink} to="/login" sx={linkStyle}>
                    Login
                  </Link>

                  <Link component={RouterLink} to="/register" sx={linkStyle}>
                    Create Account
                  </Link>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography sx={headingStyle}>Our Services</Typography>

                <Stack spacing={1.5}>
                  <Typography sx={linkStyle}>Plant Management</Typography>

                  <Typography sx={linkStyle}>Smart Irrigation</Typography>

                  <Typography sx={linkStyle}>Crop Monitoring</Typography>

                  <Typography sx={linkStyle}>Agricultural Robot</Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography sx={headingStyle}>Contact Us</Typography>

                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <EmailIcon sx={{ color: "#D9F36A", flexShrink: 0 }} />

                    <Typography
                      sx={{
                        color: "#D1DED5",
                        fontSize: 14,
                        overflowWrap: "anywhere",
                      }}
                    >
                      alhasadgate@info.com
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <LocationOnIcon sx={{ color: "#D9F36A", flexShrink: 0 }} />

                    <Typography sx={{ color: "#D1DED5", fontSize: 14 }}>
                      Jordan
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider
          sx={{
            borderColor: "rgba(255,255,255,0.14)",
            my: 4,
          }}
        />
      </Container>
    </Box>
  );
}
