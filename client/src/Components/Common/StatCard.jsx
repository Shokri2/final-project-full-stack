import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";

function StatCard({ title, value, icon, color = "primary.main", helper, onClick }) {
  const content = (
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography color="text.secondary" fontWeight={600} fontSize={14}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
            {value ?? 0}
          </Typography>
          {helper && (
            <Typography color="text.secondary" fontSize={13} sx={{ mt: 0.5 }}>
              {helper}
            </Typography>
          )}
        </Box>
        {icon && (
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              color,
              bgcolor: "action.hover",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
    </CardContent>
  );

  return (
    <Card elevation={0} sx={{ height: "100%", border: 1, borderColor: "divider", borderRadius: 3 }}>
      {onClick ? <CardActionArea onClick={onClick} sx={{ height: "100%" }}>{content}</CardActionArea> : content}
    </Card>
  );
}

export default StatCard;
