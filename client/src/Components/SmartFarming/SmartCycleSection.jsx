import { Box, Container, Typography } from "@mui/material";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import AgricultureOutlinedIcon from "@mui/icons-material/AgricultureOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import DarkSectionTitle from "./DarkSectionTitle";

const cycle = [
  { icon: <SensorsOutlinedIcon />, title: "Sense", text: "Collect information: soil, weather, plant health and photos from the field." },
  { icon: <QueryStatsOutlinedIcon />, title: "Analyse", text: "Compare it with the crop's ideal conditions and growth stage." },
  { icon: <AgricultureOutlinedIcon />, title: "Act", text: "Water, feed or treat exactly where it is needed, guided by experts." },
  { icon: <AutorenewOutlinedIcon />, title: "Learn", text: "Record the result so next season starts smarter than this one." },
];

function SmartCycleSection() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 11 }, background: "linear-gradient(180deg, #1B3321 0%, #12301F 100%)" }}>
      <Container maxWidth="lg">
        <DarkSectionTitle
          overline="HOW IT WORKS"
          title="The smart farm"
          highlight="cycle"
          subtitle="Smart farming is not a single device. It is a loop that repeats every day of the season."
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: 3,
            position: "relative",
          }}
        >
          {cycle.map((step, index) => (
            <Box key={step.title} sx={{ textAlign: "center", px: 1 }}>
              <Box
                sx={{
                  width: 84,
                  height: 84,
                  mx: "auto",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "rgba(217,243,106,0.12)",
                  border: "2px solid #D9F36A",
                  color: "#D9F36A",
                  position: "relative",
                  "& svg": { fontSize: 36 },
                }}
              >
                {step.icon}
                <Box
                  sx={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    bgcolor: "#D9F36A",
                    color: "#183D2A",
                    fontWeight: 900,
                    fontSize: 14,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {index + 1}
                </Box>
              </Box>
              <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 22, mt: 2.5 }}>{step.title}</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.72)", mt: 1, lineHeight: 1.7 }}>{step.text}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default SmartCycleSection;
