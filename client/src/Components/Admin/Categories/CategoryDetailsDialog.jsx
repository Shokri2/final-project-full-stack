import { useCallback } from "react";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import LoadingState from "../../Common/LoadingState";
import ErrorState from "../../Common/ErrorState";
import { useFetch } from "../../../Hooks/useFetch";
import { getCategory } from "../../../api/categoriesApi";
import { formatDate } from "../../../utils/format";

function CategoryDetailsContent({ id }) {
  const fetchCategory = useCallback(() => getCategory(id), [id]);
  const { data, loading, error, refetch } = useFetch(fetchCategory, [fetchCategory]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const category = data.category;

  return (
    <Stack spacing={2.5}>
      <Typography color="text.secondary">{category.description || "No description."}</Typography>
      <Box>
        <Typography fontWeight={800} sx={{ mb: 1 }}>
          Crops ({category.crops.length})
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }} useFlexGap>
          {category.crops.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No crops yet.
            </Typography>
          ) : (
            category.crops.map((crop) => (
              <Chip key={crop.id} label={crop.name} color={crop.is_active ? "primary" : "default"} variant="outlined" />
            ))
          )}
        </Stack>
      </Box>
      <Box>
        <Typography fontWeight={800} sx={{ mb: 1 }}>
          Specialist agronomists ({category.agronomists.length})
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }} useFlexGap>
          {category.agronomists.length === 0 ? (
            <Typography variant="body2" color="warning.main">
              No agronomist covers this category, so its requests cannot be assigned.
            </Typography>
          ) : (
            category.agronomists.map((agronomist) => <Chip key={agronomist.id} label={agronomist.name} />)
          )}
        </Stack>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {category.requests_count} consultation requests · created {formatDate(category.created_at)}
        {category.created_by_name ? ` by ${category.created_by_name}` : ""}
      </Typography>
    </Stack>
  );
}

function CategoryDetailsDialog({ category, onClose }) {
  return (
    <Dialog open={Boolean(category)} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={800}>{category?.name}</DialogTitle>
      <DialogContent>{category && <CategoryDetailsContent id={category.id} />}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CategoryDetailsDialog;
