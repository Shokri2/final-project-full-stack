
import { Box, Container, Typography } from "@mui/material";

const features = [
  {
    type: "image",
    title: "Farmer monitoring crops",
    image: "/images/farmer-laptop.png",
    alt: "Farmer using a laptop in a green farm",
    background: "#274730",
  },
  {
    type: "text",
    title: "Smart notifications and alerts",
    description:
      "An instant alert system that works around the clock, notifying users directly when a malfunction or abnormal condition is detected.",
    background: "#1b3321",
  },
  {
    type: "image",
    title: "Farmer in the field",
    image: "/images/farmer-field.png",
    alt: "Farmer standing in an agricultural field",
    background: "#274730",
  },
  {
    type: "text",
    title: "Crop management",
    description:
      "An integrated crop management system that helps you monitor crop conditions and make informed decisions throughout the growing season.",
    background: "#1b3321",
  },
  {
    type: "image",
    title: "Working in the field",
    image: "/images/crop-monitoring.png",
    alt: "Person using a laptop to monitor crops",
    background: "#274730",
  },
  {
    type: "text",
    title: "Intelligent irrigation management",
    description:
      "Control irrigation systems intelligently and accurately, helping you use water efficiently based on the needs of your crops.",
    background: "#1b3321",
  },
];

export default function FeaturesSection() {
  return (
    <Box
      component="section"
      id="features"
      sx={{
        width: "100%",
        bgcolor: "#354F38",
        color: "#fff",
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth={false} disableGutters>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={`${feature.title}-${index}`}
              sx={{
                minWidth: 0,
                minHeight: { xs: 260, md: 350 },
                height: { md: 350 },
                bgcolor: feature.background,
                overflow: "hidden",
              }}
            >
              {feature.type === "image" ? (
                <Box
                  component="img"
                  src={feature.image}
                  alt={feature.alt}
                  loading="lazy"
                  sx={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    minHeight: { xs: 260, md: 350 },
                    objectFit: "cover",
                    transition: "transform 500ms ease",
                    "&:hover": {
                      transform: "scale(1.035)",
                    },
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    minHeight: { xs: 260, md: 350 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    px: { xs: 3, sm: 5, lg: 7 },
                    py: { xs: 5, md: 6 },
                  }}
                >
                  <Typography
                    component="h3"
                    sx={{
                      fontSize: { xs: 24, md: 26, lg: 28 },
                      fontWeight: 700,
                      lineHeight: 1.35,
                      mb: 2,
                      color: "#fff",
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    component="p"
                    sx={{
                      fontSize: { xs: 15, md: 16, lg: 17 },
                      lineHeight: 1.9,
                      color: "rgba(255,255,255,0.76)",
                      maxWidth: 460,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
