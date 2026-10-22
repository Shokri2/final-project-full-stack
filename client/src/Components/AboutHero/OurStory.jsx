import { Box, Container, Typography } from "@mui/material";

export default function OurStory() {
  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        py: { xs: 7, md: 10 },
        bgcolor: "#456448",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xl">
        {/* Heading */}
        <Box
          sx={{
            textAlign: "center",
            maxWidth: 900,
            mx: "auto",
            mb: { xs: 5, md: 6 },
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontFamily: '"Poppins", "Arial", sans-serif',
              fontSize: { xs: 38, sm: 48, md: 64 },
              fontWeight: 800,
              color: "#eaf3eb",
              letterSpacing: "-1.5px",
              lineHeight: 1.2,
            }}
          >
            Our{" "}
            <Box component="span" sx={{ color: "#b5d213" }}>
              Story
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: 3,
              mx: "auto",
              maxWidth: 850,
              color: "#d5ddd4",
              fontSize: { xs: 14, sm: 16, md: 18 },
              lineHeight: 2,
              letterSpacing: { xs: 0.2, md: 0.4 },
              px: { xs: 1, md: 3 },
            }}
          >
            Our journey began with a simple belief agriculture should be
            smarter more efficient and easier for everyone We combine
            intelligent technology with sustainable farming to help farmers care
            for their crops use water wisely and grow a greener future
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1.5, sm: 2, md: 3 },
            maxWidth: 1050,
            mx: "auto",
            px: { xs: 0.5, sm: 2 },
          }}
        >
          <Box
            sx={{
              width: { xs: "42%", sm: "40%", md: "42%" },
              height: { xs: 150, sm: 220, md: 270 },
              flexShrink: 1,
              borderRadius: { xs: "14px", md: "22px" },
              overflow: "hidden",
              border: "1px solid rgba(234,243,235,0.15)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
              transform: { xs: "translateY(-5px)", md: "translateY(-8px)" },
            }}
          >
            <Box
              component="img"
              src="/images/story-farm.png"
              alt="Green agricultural farm"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.5s ease",
                "&:hover": {
                  transform: "scale(1.06)",
                },
              }}
            />
          </Box>

          <Box
            sx={{
              width: { xs: 48, sm: 68, md: 100 },
              flexShrink: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src="/images/center.png"
              alt="Green leaves"
              sx={{
                width: "100%",
                height: { xs: 55, sm: 75, md: 100 },
                objectFit: "contain",
                opacity: 0.95,
                filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.12))",
              }}
            />
          </Box>

          <Box
            sx={{
              width: { xs: "42%", sm: "40%", md: "42%" },
              height: { xs: 150, sm: 220, md: 270 },
              flexShrink: 1,
              borderRadius: { xs: "14px", md: "22px" },
              overflow: "hidden",
              border: "1px solid rgba(234,243,235,0.15)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
              transform: { xs: "translateY(5px)", md: "translateY(8px)" },
            }}
          >
            <Box
              component="img"
              src="/images/story-leaves.png"
              alt="Agricultural robot in the field"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.5s ease",
                "&:hover": {
                  transform: "scale(1.06)",
                },
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
