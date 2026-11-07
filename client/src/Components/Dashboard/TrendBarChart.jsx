import { Box, Stack, Tooltip, Typography } from "@mui/material";

const shortDay = (value) => new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

function TrendBarChart({ data = [], valueKey = "requests", height = 180 }) {
  const max = Math.max(...data.map((item) => item[valueKey]), 1);
  const total = data.reduce((sum, item) => sum + item[valueKey], 0);

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {total} requests in the last {data.length} days
      </Typography>
      <Stack
        direction="row"
        spacing={0.75}
        sx={{ height, alignItems: "flex-end", borderBottom: 1, borderColor: "divider", pb: 0.5 }}
        role="img"
        aria-label={`Bar chart of requests per day, ${total} in total`}
      >
        {data.map((item) => (
          <Tooltip key={item.date} title={`${shortDay(item.date)}: ${item[valueKey]} requests`} arrow>
            <Box
              sx={{
                flex: 1,
                height: `${Math.max((item[valueKey] / max) * 100, item[valueKey] ? 6 : 2)}%`,
                bgcolor: item[valueKey] ? "primary.main" : "action.hover",
                borderRadius: "6px 6px 2px 2px",
                transition: "opacity 0.2s",
                "&:hover": { opacity: 0.75 },
              }}
            />
          </Tooltip>
        ))}
      </Stack>
      <Stack direction="row" sx={{ justifyContent: "space-between", mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {data[0] && shortDay(data[0].date)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Today
        </Typography>
      </Stack>
    </Box>
  );
}

export default TrendBarChart;
