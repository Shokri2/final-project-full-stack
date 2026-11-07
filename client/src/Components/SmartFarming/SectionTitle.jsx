import { Box, Typography } from "@mui/material";

function SectionTitle({ overline, title, subtitle }) {
  return (
    <Box sx={{ textAlign: "center", maxWidth: 720, mx: "auto", mb: 6 }}>
      <Typography sx={{ color: "primary.main", fontWeight: 800, letterSpacing: 3, fontSize: 13 }}>{overline}</Typography>
      <Typography component="h2" sx={{ fontWeight: 900, fontSize: { xs: 28, md: 38 }, mt: 1 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: 17, lineHeight: 1.7 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default SectionTitle;
