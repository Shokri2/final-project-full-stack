import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import SectionTitle from "./SectionTitle";

const benefits = [
  { title: "Save water", text: "Irrigating by need instead of by schedule avoids over-watering and runoff." },
  { title: "Healthier crops", text: "Early warnings mean problems are treated while they are still small." },
  { title: "Lower costs", text: "Fertiliser and pesticides go only where they are needed." },
  { title: "Better yields", text: "Plants grown in the right conditions at each stage produce more." },
  { title: "Less guesswork", text: "Decisions are based on data and expert advice, not habit." },
  { title: "Protect the land", text: "Using fewer inputs keeps soil and groundwater healthy for the next season." },
];

function BenefitsSection() {
  return (
    <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: "action.hover" }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              component="img"
              src="/images/farmer-field.png"
              alt="Farmer working in a healthy field"
              sx={{ width: "100%", borderRadius: 5, objectFit: "cover", maxHeight: 460 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ "& > div": { textAlign: "left", mx: 0, mb: 4 } }}>
              <SectionTitle overline="WHY IT MATTERS" title="Grow more with less" />
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
              {benefits.map((benefit) => (
                <Stack key={benefit.title} direction="row" spacing={1.5}>
                  <CheckCircleRoundedIcon color="primary" sx={{ mt: 0.25 }} />
                  <Box>
                    <Typography fontWeight={800}>{benefit.title}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                      {benefit.text}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default BenefitsSection;
