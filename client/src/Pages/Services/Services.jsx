import { Box, Button, Card, CardContent, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { services } from "../../Components/Services/servicesData";

function Services() {
  return (
    <>
      <Box sx={{ bgcolor: "#12301F", color: "#fff", py: { xs: 7, md: 10 }, textAlign: "center" }}>
        <Container maxWidth="md">
          <Typography sx={{ color: "#D9F36A", fontWeight: 800, letterSpacing: 4, fontSize: 13 }}>OUR SERVICES</Typography>
          <Typography component="h1" sx={{ fontWeight: 900, fontSize: { xs: 34, md: 50 }, lineHeight: 1.1, mt: 1.5 }}>
            Everything you need to{" "}
            <Box component="span" sx={{ color: "#D9F36A", fontStyle: "italic", fontWeight: 400 }}>
              grow with confidence
            </Box>
          </Typography>
          <Typography sx={{ mt: 2.5, fontSize: { xs: 16, md: 18 }, lineHeight: 1.8, opacity: 0.85 }}>
            AL-HASAD GATE combines a practical crop guide with direct access to agronomists who specialise in your
            crops.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 7, md: 10 }, background: "linear-gradient(180deg, #1B3321 0%, #12301F 100%)" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {services.map((service) => (
              <Card
                key={service.title}
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 5,
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  transition: "transform 0.25s, background-color 0.25s",
                  "&:hover": { transform: "translateY(-6px)", bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <CardContent sx={{ p: 3.5, height: "100%", display: "flex", flexDirection: "column" }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "#D9F36A",
                      color: "#183D2A",
                      mb: 2.5,
                      "& svg": { fontSize: 30 },
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={800}>
                    {service.title}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, mt: 1, flex: 1 }}>
                    {service.description}
                  </Typography>
                  <Button
                    component={Link}
                    to={service.to}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ color: "#D9F36A", alignSelf: "flex-start", mt: 2, px: 0, fontWeight: 700 }}
                  >
                    {service.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Services;
