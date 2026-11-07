import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function DashboardPanel({ title, actionLabel, actionTo, children, sx }) {
  return (
    <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 3, height: "100%", ...sx }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          {title}
        </Typography>
        {actionLabel && (
          <Button component={Link} to={actionTo} size="small">
            {actionLabel}
          </Button>
        )}
      </Stack>
      <Box>{children}</Box>
    </Paper>
  );
}

export default DashboardPanel;
