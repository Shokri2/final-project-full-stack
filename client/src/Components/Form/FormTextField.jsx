import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

function FormTextField({ name, control, rules, helperText = " ", ...props }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...props}
          value={field.value ?? ""}
          fullWidth
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? helperText}
        />
      )}
    />
  );
}

export default FormTextField;
