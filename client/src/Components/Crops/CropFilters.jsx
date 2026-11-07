import { useEffect, useState } from "react";
import { Chip, FormControl, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDebounce } from "../../Hooks/useDebounce";

const sortOptions = [
  { value: "name:asc", label: "Name (A–Z)" },
  { value: "name:desc", label: "Name (Z–A)" },
  { value: "rating:desc", label: "Top rated" },
  { value: "growth_duration_days:asc", label: "Fastest to harvest" },
  { value: "growth_duration_days:desc", label: "Longest season" },
];

function CropFilters({ categories, query, onSearch, onCategory, onSort }) {
  const [search, setSearch] = useState(query.search);
  const debounced = useDebounce(search);

  useEffect(() => {
    setSearch(query.search);
  }, [query.search]);

  useEffect(() => {
    if (debounced !== query.search) {
      onSearch(debounced.trim());
    }
  }, [debounced]);

  return (
    <Stack spacing={2} sx={{ mb: 4 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search crops by name..."
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { bgcolor: "background.paper", borderRadius: 3 },
            },
            htmlInput: { "aria-label": "Search crops" },
          }}
        />
        <FormControl sx={{ minWidth: { sm: 220 } }}>
          <InputLabel id="crop-sort">Sort by</InputLabel>
          <Select
            labelId="crop-sort"
            label="Sort by"
            value={`${query.sort}:${query.order}`}
            onChange={(event) => onSort(...event.target.value.split(":"))}
            sx={{ bgcolor: "background.paper", borderRadius: 3 }}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }} useFlexGap>
        <Chip
          label="All crops"
          clickable
          color={query.category_id ? "default" : "primary"}
          variant={query.category_id ? "outlined" : "filled"}
          onClick={() => onCategory("")}
        />
        {categories.map((category) => {
          const active = String(category.id) === String(query.category_id);

          return (
            <Chip
              key={category.id}
              label={`${category.name} (${category.active_crops_count})`}
              clickable
              color={active ? "primary" : "default"}
              variant={active ? "filled" : "outlined"}
              onClick={() => onCategory(active ? "" : category.id)}
            />
          );
        })}
      </Stack>
    </Stack>
  );
}

export default CropFilters;
