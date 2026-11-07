import { Box, CircularProgress, Skeleton, Stack, Typography } from "@mui/material";

function LoadingState({ message = "Loading...", fullPage = false, variant = "spinner", rows = 4 }) {
  if (variant === "skeleton") {
    return (
      <Stack spacing={1.5} sx={{ py: 2 }}>
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} variant="rounded" height={48} />
        ))}
      </Stack>
    );
  }

  return (
    <Box
      role="status"
      sx={{
        minHeight: fullPage ? "100vh" : 240,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        bgcolor: fullPage ? "background.default" : "transparent",
      }}
    >
      <CircularProgress color="primary" />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}

export default LoadingState;
