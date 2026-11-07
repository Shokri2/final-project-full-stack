import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function FilterSelect({ label, value, onChange, options, allLabel = "All", minWidth = 160 }) {
  const id = `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <FormControl size="small" sx={{ minWidth }}>
      <InputLabel id={id}>{label}</InputLabel>
      <Select labelId={id} label={label} value={value} onChange={(event) => onChange(event.target.value)}>
        <MenuItem value="">{allLabel}</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default FilterSelect;
