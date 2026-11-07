import { Grid } from "@mui/material";
import FormTextField from "../../Form/FormTextField";
import FormSelect from "../../Form/FormSelect";
import { lengthRules } from "../../Form/rules";

const temperatureRules = {
  validate: (value) => value === "" || value === null || (Number(value) >= -50 && Number(value) <= 60) || "Between -50 and 60 °C.",
};

const daysRules = {
  validate: (value) => value === "" || value === null || (Number.isInteger(Number(value)) && Number(value) > 0) || "Enter whole days.",
};

function CropFormFields({ control, categoryOptions, disabled, getValues }) {
  return (
    <Grid container columnSpacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormTextField name="name" control={control} rules={lengthRules("English name", 2, 100)} label="Name (English)" disabled={disabled} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormTextField name="name_ar" control={control} rules={lengthRules("Arabic name", 2, 100)} label="Name (Arabic)" disabled={disabled} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormSelect
          name="category_id"
          control={control}
          rules={{ required: "Please choose a category." }}
          label="Category"
          options={categoryOptions}
          disabled={disabled}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormTextField name="image" control={control} label="Image URL (optional)" disabled={disabled} />
      </Grid>
      <Grid size={12}>
        <FormTextField
          name="description"
          control={control}
          rules={{ maxLength: { value: 5000, message: "Description is too long." } }}
          label="Description"
          multiline
          minRows={3}
          disabled={disabled}
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <FormTextField name="temperature_min" control={control} rules={temperatureRules} label="Min °C" type="number" disabled={disabled} />
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <FormTextField
          name="temperature_max"
          control={control}
          rules={{
            validate: (value) => {
              const base = temperatureRules.validate(value);
              const min = getValues("temperature_min");

              if (base !== true) {
                return base;
              }

              return value === "" || min === "" || Number(min) <= Number(value) || "Must be ≥ min temperature.";
            },
          }}
          label="Max °C"
          type="number"
          disabled={disabled}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormTextField name="growth_duration_days" control={control} rules={daysRules} label="Days to harvest" type="number" disabled={disabled} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormTextField name="sunlight" control={control} label="Sunlight" disabled={disabled} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormTextField name="water_needs" control={control} label="Water needs" disabled={disabled} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormTextField name="soil_type" control={control} label="Soil type" disabled={disabled} />
      </Grid>
    </Grid>
  );
}

export default CropFormFields;
