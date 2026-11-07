import { Controller } from "react-hook-form";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";

function FormSelect({ name, control, rules, label, options, helperText = " ", disabled, multiple }) {
  const id = `select-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <FormControl fullWidth error={Boolean(fieldState.error)} disabled={disabled}>
          <InputLabel id={id}>{label}</InputLabel>
          <Select
            {...field}
            labelId={id}
            label={label}
            multiple={multiple}
            value={field.value ?? (multiple ? [] : "")}
            renderValue={
              multiple
                ? (selected) =>
                    options
                      .filter((option) => selected.includes(option.value))
                      .map((option) => option.label)
                      .join(", ")
                : undefined
            }
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{fieldState.error?.message ?? helperText}</FormHelperText>
        </FormControl>
      )}
    />
  );
}

export default FormSelect;
