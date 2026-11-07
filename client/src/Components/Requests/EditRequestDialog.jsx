import { useEffect } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import FormTextField from "../Form/FormTextField";
import FormSelect from "../Form/FormSelect";
import SubmitButton from "../Form/SubmitButton";
import { lengthRules } from "../Form/rules";
import { PRIORITY_OPTIONS } from "./requestOptions";

const toFormValues = (request) => ({
  title: request.title,
  description: request.description,
  priority: request.priority,
  farm_location: request.farm_location ?? "",
  field_area_m2: request.field_area_m2 ? Number(request.field_area_m2) : "",
});

function EditRequestDialog({ open, request, loading, onSubmit, onClose }) {
  const { control, handleSubmit, reset, formState } = useForm({ defaultValues: toFormValues(request), mode: "onTouched" });

  useEffect(() => {
    if (open) {
      reset(toFormValues(request));
    }
  }, [open, request, reset]);

  const submit = (values) => {
    const changes = Object.fromEntries(
      Object.entries(values).filter(([key]) => formState.dirtyFields[key]).map(([key, value]) => [key, key === "field_area_m2" && value === "" ? null : value]),
    );
    return onSubmit(changes);
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit(submit)} noValidate>
        <DialogTitle fontWeight={800}>Edit request</DialogTitle>
        <DialogContent>
          <Grid container spacing={1} sx={{ pt: 1 }}>
            <Grid size={12}>
              <FormTextField name="title" control={control} rules={lengthRules("Title", 5, 150)} label="Title" disabled={loading} />
            </Grid>
            <Grid size={12}>
              <FormTextField
                name="description"
                control={control}
                rules={lengthRules("Description", 20, 5000)}
                label="Description"
                multiline
                minRows={4}
                disabled={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormSelect name="priority" control={control} label="Priority" options={PRIORITY_OPTIONS} disabled={loading} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormTextField name="field_area_m2" control={control} label="Field area (m²)" type="number" disabled={loading} />
            </Grid>
            <Grid size={12}>
              <FormTextField name="farm_location" control={control} label="Farm location" disabled={loading} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <SubmitButton loading={loading} disabled={loading || !formState.isDirty} size="medium" loadingText="Saving...">
            Save changes
          </SubmitButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default EditRequestDialog;
