import { useEffect, useState } from "react";
import { Button, InputAdornment, Paper, Stack, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import { useDebounce } from "../../Hooks/useDebounce";

function TableToolbar({ search = "", onSearch, placeholder = "Search...", children, onReset, showReset }) {
  const [value, setValue] = useState(search);
  const debounced = useDebounce(value);

  useEffect(() => {
    setValue(search);
  }, [search]);

  useEffect(() => {
    if (debounced !== search) {
      onSearch(debounced.trim());
    }
  }, [debounced]);

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2, border: 1, borderColor: "divider", borderRadius: 3 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ alignItems: { md: "center" } }}>
        <TextField
          size="small"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          sx={{ flex: 1, minWidth: { md: 240 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
            htmlInput: { "aria-label": placeholder },
          }}
        />
        {children}
        {showReset && onReset && (
          <Button color="inherit" startIcon={<FilterAltOffOutlinedIcon />} onClick={onReset} sx={{ flexShrink: 0 }}>
            Clear
          </Button>
        )}
      </Stack>
    </Paper>
  );
}

export default TableToolbar;
