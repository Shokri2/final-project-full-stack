import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import PageHeader from "../Common/PageHeader";
import StatusChip from "../Common/StatusChip";
import RequestSummaryCard from "./RequestSummaryCard";
import RequestResponseCard from "./RequestResponseCard";
import RequestImages from "./RequestImages";
import RequestTimeline from "./RequestTimeline";
import { STATUS_DESCRIPTIONS } from "./requestOptions";

function RequestDetailsLayout({ request, breadcrumbs, actions, imagesAction, onDeleteImage, showFarmer, children }) {
  return (
    <>
      <PageHeader title={request.title} breadcrumbs={breadcrumbs} />

      <Paper
        elevation={0}
        sx={{ p: 2, mb: 3, border: 1, borderColor: "divider", borderRadius: 3, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
      >
        <StatusChip status={request.status} size="medium" />
        <Typography color="text.secondary" sx={{ flex: 1, minWidth: 200 }}>
          {STATUS_DESCRIPTIONS[request.status]}
        </Typography>
        {actions && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }} useFlexGap>
            {actions}
          </Stack>
        )}
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <RequestResponseCard request={request} />
            <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 1.5 }}>
                Problem description
              </Typography>
              <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{request.description}</Typography>
            </Paper>
            <RequestImages images={request.attachments} onDelete={onDeleteImage} action={imagesAction} />
            {children}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <RequestSummaryCard request={request} showFarmer={showFarmer} />
            <Box>
              <RequestTimeline history={request.history} />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default RequestDetailsLayout;
