import { Box, Container, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CropBrowser from "../../Components/Crops/CropBrowser";
import { darkTheme } from "../../Context/theme";

function CropGuide() {
  return (
    <>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          color: "#fff",
          py: { xs: 7, md: 10 },
          background: "linear-gradient(135deg, #12301F 0%, #246B3D 55%, #3E8E4F 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            right: -120,
            top: -160,
            bgcolor: "rgba(217,243,106,0.12)",
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", textAlign: "center" }}>
          <Typography sx={{ color: "#D9F36A", fontWeight: 800, letterSpacing: 4, fontSize: 13 }}>
            CROP GUIDE
          </Typography>
          <Typography
            component="h1"
            sx={{ fontWeight: 900, fontSize: { xs: 36, sm: 46, md: 58 }, lineHeight: 1.1, mt: 1.5 }}
          >
            Grow Smarter.{" "}
            <Box component="span" sx={{ color: "#D9F36A" }}>
              Harvest Better.
            </Box>
          </Typography>
          <Typography
            sx={{ maxWidth: 640, mx: "auto", mt: 2.5, fontSize: { xs: 16, md: 18 }, lineHeight: 1.7, opacity: 0.88 }}
          >
            Discover the right crops for your farm, explore their growing requirements, and follow every
            stage from planting to harvest.
          </Typography>
        </Container>
      </Box>

      <ThemeProvider theme={darkTheme}>
        <Box sx={{ background: "linear-gradient(180deg, #1B3321 0%, #12301F 100%)", color: "text.primary" }}>
          <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
            <CropBrowser detailsPath={(crop) => `/crops/${crop.id}`} />
          </Container>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default CropGuide;
