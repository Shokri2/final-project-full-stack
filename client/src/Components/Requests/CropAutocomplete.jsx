import { Autocomplete, Avatar, Box, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { getCropImage } from "../../utils/cropImages";

function CropAutocomplete({ control, crops, loading, disabled }) {
  return (
    <Controller
      name="crop_id"
      control={control}
      rules={{ required: "Please choose the crop you need help with." }}
      render={({ field, fieldState }) => (
        <Autocomplete
          options={crops}
          loading={loading}
          disabled={disabled}
          value={crops.find((crop) => String(crop.id) === String(field.value)) ?? null}
          onChange={(_, crop) => field.onChange(crop ? crop.id : "")}
          onBlur={field.onBlur}
          getOptionLabel={(crop) => crop.name}
          groupBy={(crop) => crop.category_name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={(props, crop) => {
            const { key, ...optionProps } = props;

            return (
              <Box component="li" key={key} {...optionProps} sx={{ display: "flex", gap: 1.5 }}>
                <Avatar variant="rounded" src={getCropImage(crop)} sx={{ width: 32, height: 32 }} />
                <Typography>{crop.name}</Typography>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Crop"
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message ?? "Which crop is this request about?"}
            />
          )}
        />
      )}
    />
  );
}

export default CropAutocomplete;
