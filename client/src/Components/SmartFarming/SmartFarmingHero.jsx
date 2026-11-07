import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function SmartFarmingHero() {
  return (
    <Box sx={{ bgcolor: "#12301F", color: "#fff", py: { xs: 7, md: 10 }, overflow: "hidden" }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography sx={{ color: "#D9F36A", fontWeight: 800, letterSpacing: 4, fontSize: 13 }}>
              SMART FARMING
            </Typography>
            <Typography component="h1" sx={{ fontWeight: 900, fontSize: { xs: 36, md: 52 }, lineHeight: 1.1, mt: 1.5 }}>
              Farming that{" "}
              <Box component="span" sx={{ color: "#D9F36A" }}>
                thinks
              </Box>{" "}
              before it acts
            </Typography>
            <Typography sx={{ mt: 2.5, fontSize: { xs: 16, md: 18 }, lineHeight: 1.8, opacity: 0.88 }}>
              Smart farming uses data, sensors and expert knowledge to decide exactly when to water, feed and
              protect each crop. The result: healthier plants, less waste and better harvests.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ bgcolor: "#D9F36A", color: "#183D2A", fontWeight: 800, "&:hover": { bgcolor: "#E8FF91" } }}
              >
                Start for free
              </Button>
              <Button
                component={Link}
                to="/crop-guide"
                variant="outlined"
                size="large"
                sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)", "&:hover": { borderColor: "#fff" } }}
              >
                Explore the crop guide
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src="/images/crop-monitoring.png"
              alt="Farmer monitoring crops with smart technology"
              sx={{ width: "100%", borderRadius: 5, boxShadow: "0 30px 60px rgba(0,0,0,0.35)" }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default SmartFarmingHero;
