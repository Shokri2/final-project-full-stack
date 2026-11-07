import { Box, Typography } from "@mui/material";

function DarkSectionTitle({ overline, title, highlight, subtitle }) {
  return (
    <Box sx={{ textAlign: "center", maxWidth: 720, mx: "auto", mb: 6 }}>
      <Typography sx={{ color: "#D9F36A", fontWeight: 800, letterSpacing: 4, fontSize: 13 }}>{overline}</Typography>
      <Typography component="h2" sx={{ color: "#fff", fontWeight: 900, fontSize: { xs: 28, md: 40 }, mt: 1.5 }}>
        {title}{" "}
        {highlight && (
          <Box component="span" sx={{ color: "#D9F36A", fontStyle: "italic", fontWeight: 400 }}>
            {highlight}
          </Box>
        )}
      </Typography>
      {subtitle && (
        <Typography sx={{ color: "rgba(255,255,255,0.75)", mt: 1.5, fontSize: 17, lineHeight: 1.7 }}>{subtitle}</Typography>
      )}
    </Box>
  );
}

export default DarkSectionTitle;
