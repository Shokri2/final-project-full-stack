import { Box, Button, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FormTextField from "../../Form/FormTextField";
import { lengthRules } from "../../Form/rules";

const emptyStage = { name: "", name_ar: "", duration_days: "", tips: "" };

const durationRules = {
  validate: (value) => value === "" || value === null || (Number.isInteger(Number(value)) && Number(value) > 0) || "Enter whole days.",
};

function GrowthStagesEditor({ control, disabled }) {
  const { fields, append, remove, move } = useFieldArray({ control, name: "growth_stages" });

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
        <Typography fontWeight={800}>Growth stages ({fields.length})</Typography>
        <Button startIcon={<AddIcon />} onClick={() => append(emptyStage)} disabled={disabled || fields.length >= 20}>
          Add stage
        </Button>
      </Stack>

      {fields.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No stages yet. Add them in order from planting to harvest.
        </Typography>
      )}

      <Stack spacing={1.5}>
        {fields.map((field, index) => (
          <Paper key={field.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography fontWeight={700} color="primary.main">
                Stage {index + 1}
              </Typography>
              <Stack direction="row">
                <Tooltip title="Move up">
                  <span>
                    <IconButton size="small" onClick={() => move(index, index - 1)} disabled={disabled || index === 0} aria-label="Move stage up">
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Move down">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => move(index, index + 1)}
                      disabled={disabled || index === fields.length - 1}
                      aria-label="Move stage down"
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Remove stage">
                  <IconButton size="small" color="error" onClick={() => remove(index)} disabled={disabled} aria-label="Remove stage">
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 140px" }, columnGap: 1.5 }}>
              <FormTextField
                name={`growth_stages.${index}.name`}
                control={control}
                rules={lengthRules("Stage name", 2, 100)}
                label="Name (English)"
                size="small"
                disabled={disabled}
              />
              <FormTextField
                name={`growth_stages.${index}.name_ar`}
                control={control}
                rules={lengthRules("Arabic name", 2, 100)}
                label="Name (Arabic)"
                size="small"
                disabled={disabled}
              />
              <FormTextField
                name={`growth_stages.${index}.duration_days`}
                control={control}
                rules={durationRules}
                label="Days"
                type="number"
                size="small"
                disabled={disabled}
              />
            </Box>
            <FormTextField name={`growth_stages.${index}.tips`} control={control} label="Tips" size="small" multiline disabled={disabled} />
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

export default GrowthStagesEditor;
