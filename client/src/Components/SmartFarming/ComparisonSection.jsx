import { Box, Container, Stack, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DarkSectionTitle from "./DarkSectionTitle";

const rows = [
  { topic: "Irrigation", traditional: "Fixed schedule, same amount every day", smart: "Water based on soil moisture and weather" },
  { topic: "Pests & disease", traditional: "Noticed when damage is already visible", smart: "Early signs spotted and treated quickly" },
  { topic: "Fertiliser", traditional: "Same dose across the whole field", smart: "Applied where and when the crop needs it" },
  { topic: "Decisions", traditional: "Based on habit and guesswork", smart: "Based on data and expert advice" },
  { topic: "Expert help", traditional: "Hard to reach, slow to arrive", smart: "Ask a specialist online with photos" },
  { topic: "Records", traditional: "Kept in memory or not at all", smart: "Every season saved to learn from" },
];

function Column({ title, items, good }) {
  return (
    <Box
      sx={{
        flex: 1,
        p: { xs: 3, md: 4 },
        borderRadius: 5,
        bgcolor: good ? "rgba(217,243,106,0.08)" : "rgba(255,255,255,0.04)",
        border: good ? "1px solid rgba(217,243,106,0.45)" : "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <Typography sx={{ color: good ? "#D9F36A" : "rgba(255,255,255,0.8)", fontWeight: 900, fontSize: 22, mb: 3 }}>{title}</Typography>
      <Stack spacing={2.5}>
        {items.map((item) => (
          <Stack key={item.topic} direction="row" spacing={1.5}>
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                bgcolor: good ? "#D9F36A" : "rgba(255,255,255,0.12)",
                color: good ? "#183D2A" : "rgba(255,255,255,0.7)",
              }}
            >
              {good ? <CheckRoundedIcon sx={{ fontSize: 18 }} /> : <CloseRoundedIcon sx={{ fontSize: 18 }} />}
            </Box>
            <Box>
              <Typography sx={{ color: "#fff", fontWeight: 700 }}>{item.topic}</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 15, mt: 0.25 }}>{item.text}</Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

function ComparisonSection() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 11 }, background: "linear-gradient(180deg, #354F38 0%, #1B3321 100%)" }}>
      <Container maxWidth="lg">
        <DarkSectionTitle
          overline="THE DIFFERENCE"
          title="Traditional vs"
          highlight="smart farming"
          subtitle="Same land, same crop. The difference is how decisions are made."
        />
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Column title="Traditional farming" items={rows.map((row) => ({ topic: row.topic, text: row.traditional }))} />
          <Column title="Smart farming" good items={rows.map((row) => ({ topic: row.topic, text: row.smart }))} />
        </Stack>
      </Container>
    </Box>
  );
}

export default ComparisonSection;
