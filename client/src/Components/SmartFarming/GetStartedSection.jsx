import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import SectionTitle from "./SectionTitle";

const steps = [
  {
    title: "Learn your crop",
    text: "Open the crop guide to see the ideal temperature, water, sunlight and every growth stage.",
  },
  {
    title: "Watch the signs",
    text: "Compare what you see in the field with the guide. Take clear photos of anything unusual.",
  },
  {
    title: "Ask an agronomist",
    text: "Submit a consultation request with your photos. A specialist in your crop is assigned to it.",
  },
  {
    title: "Act and track",
    text: "Follow the answer step by step, track the status, and rate the advice when you are done.",
  },
];

function GetStartedSection() {
  return (
    <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
      <Container maxWidth="lg">
        <SectionTitle
          overline="GET STARTED"
          title="Smart farming with AL-HASAD GATE"
          subtitle="You don't need expensive equipment to farm smarter. Start with knowledge and expert advice."
        />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 3 }}>
          {steps.map((step, index) => (
            <Paper key={step.title} elevation={0} sx={{ p: 3, borderRadius: 4, border: 1, borderColor: "divider", position: "relative" }}>
              <Typography sx={{ fontSize: 44, fontWeight: 900, color: "primary.main", opacity: 0.25, lineHeight: 1 }}>
                {String(index + 1).padStart(2, "0")}
              </Typography>
              <Typography variant="h6" fontWeight={800} sx={{ mt: 1 }}>
                {step.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
                {step.text}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Paper
          elevation={0}
          sx={{
            mt: 7,
            p: { xs: 4, md: 6 },
            borderRadius: 5,
            textAlign: "center",
            color: "#fff",
            background: "linear-gradient(135deg, #12301F 0%, #246B3D 100%)",
          }}
        >
          <Typography sx={{ fontWeight: 900, fontSize: { xs: 26, md: 34 } }}>Ready to farm smarter?</Typography>
          <Typography sx={{ mt: 1.5, opacity: 0.88, maxWidth: 560, mx: "auto" }}>
            Create a free account and get answers from agronomists who specialise in your crops.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "center", mt: 3.5 }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              sx={{ bgcolor: "#D9F36A", color: "#183D2A", fontWeight: 800, "&:hover": { bgcolor: "#E8FF91" } }}
            >
              Create free account
            </Button>
            <Button component={Link} to="/contact" size="large" sx={{ color: "#fff" }}>
              Talk to us
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default GetStartedSection;
