import { Box, Chip, Paper, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import EmptyState from "../Common/EmptyState";

const withDayRanges = (stages) => {
  let day = 1;

  return stages.map((stage) => {
    const start = day;
    const end = stage.duration_days ? start + stage.duration_days - 1 : null;
    day = end ? end + 1 : day;
    return { ...stage, start, end };
  });
};

function GrowthStages({ stages = [] }) {
  if (stages.length === 0) {
    return (
      <Paper elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3 }}>
        <EmptyState title="Growth stages coming soon" description="Our agronomists haven't added the stages for this crop yet." />
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: 1, borderColor: "divider", borderRadius: 3 }}>
      <Stepper orientation="vertical" nonLinear activeStep={-1}>
        {withDayRanges(stages).map((stage) => (
          <Step key={stage.id} expanded active>
            <StepLabel
              slotProps={{
                stepIcon: { sx: { "&.Mui-active, &.MuiStepIcon-root": { color: "primary.main" } } },
              }}
            >
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                <Typography fontWeight={800}>{stage.name}</Typography>
                {stage.duration_days && (
                  <Chip
                    size="small"
                    variant="outlined"
                    color="primary"
                    label={`Day ${stage.start}–${stage.end} · ${stage.duration_days} days`}
                  />
                )}
              </Box>
            </StepLabel>
            <StepContent>
              <Typography color="text.secondary">{stage.tips || "No tips added for this stage."}</Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
}

export default GrowthStages;
