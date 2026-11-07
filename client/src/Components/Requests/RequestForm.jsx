import { Box, Grid, Typography } from "@mui/material";
import FormTextField from "../Form/FormTextField";
import FormSelect from "../Form/FormSelect";
import CropAutocomplete from "./CropAutocomplete";
import { lengthRules } from "../Form/rules";
import { PRIORITY_OPTIONS } from "./requestOptions";

const areaRules = {
  validate: (value) =>
    value === "" || value === null || (Number(value) > 0 && Number(value) <= 100000000) || "Enter a positive area in m².",
};

function RequestForm({ control, crops, cropsLoading, disabled }) {
  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, md: 8 }}>
        <CropAutocomplete control={control} crops={crops} loading={cropsLoading} disabled={disabled} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormSelect
          name="priority"
          control={control}
          label="Priority"
          options={PRIORITY_OPTIONS}
          disabled={disabled}
          helperText="High = the crop is at risk now."
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormTextField
          name="title"
          control={control}
          rules={lengthRules("Title", 5, 150)}
          label="Title"
          placeholder="e.g. Yellow spots on tomato leaves"
          disabled={disabled}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormTextField
          name="description"
          control={control}
          rules={lengthRules("Description", 20, 5000)}
          label="Describe the problem"
          placeholder="What do you see? Since when? What have you tried so far?"
          multiline
          minRows={5}
          disabled={disabled}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 7 }}>
        <FormTextField
          name="farm_location"
          control={control}
          rules={{ maxLength: { value: 200, message: "Location cannot exceed 200 characters." } }}
          label="Farm location (optional)"
          placeholder="City or village"
          disabled={disabled}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 5 }}>
        <FormTextField
          name="field_area_m2"
          control={control}
          rules={areaRules}
          label="Field area in m² (optional)"
          type="number"
          disabled={disabled}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Box>
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Photos
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default RequestForm;
