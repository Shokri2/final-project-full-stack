import { Box, Container, Typography } from "@mui/material";

export default function AboutHero() {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: 380, sm: 460, md: 580 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        isolation: "isolate",

        backgroundColor: "#0A1811",

        "&::before": {
          content: '""',
          position: "absolute",
          inset: "-8px",
          backgroundImage: 'url("/images/about-robot.png")',
          backgroundSize: "cover",
          backgroundPosition: "center 55%",
          backgroundRepeat: "no-repeat",
          filter: "blur(2px)",
          transform: "scale(1.02)",
          zIndex: -2,
        },

        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(
              90deg,
              rgba(10, 24, 17, 0.48),
              rgba(10, 24, 17, 0.28),
              rgba(10, 24, 17, 0.48)
            ),
            linear-gradient(
              0deg,
              rgba(17, 30, 27, 0.4),
              transparent 45%
            )
          `,
          zIndex: -1,
        },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: "center",
            position: "relative",
            zIndex: 1,
            py: { xs: 8, md: 10 },
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Poppins", "Arial", sans-serif',
              fontSize: {
                xs: 46,
                sm: 68,
                md: 100,
              },
              fontWeight: 800,
              letterSpacing: {
                xs: 2,
                sm: 5,
                md: 8,
              },
              lineHeight: 1.1,
              color: "#FFFFFF",
              textTransform: "uppercase",
              textShadow: "0 5px 25px rgba(0,0,0,0.8)",
            }}
          >
            ABOUT{" "}
            <Box
              component="span"
              sx={{
                color: "#D9F36A",
                textShadow: "0 4px 25px rgba(217,243,106,0.25)",
              }}
            >
              US
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: { xs: 2, md: 3 },
              mx: "auto",
              maxWidth: 600,
              fontSize: { xs: 14, sm: 16, md: 18 },
              lineHeight: 1.9,
              fontWeight: 400,
              color: "rgba(255,255,255,0.95)",
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
            }}
          >
            Growing a smarter future through intelligent agricultural
            technology
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
