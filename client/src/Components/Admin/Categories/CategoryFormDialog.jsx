import { useEffect } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import FormTextField from "../../Form/FormTextField";
import SubmitButton from "../../Form/SubmitButton";
import { lengthRules } from "../../Form/rules";

const toValues = (category) => ({
  name: category?.name ?? "",
  description: category?.description ?? "",
  image: category?.image ?? "",
});

function CategoryFormDialog({ open, category, loading, onSubmit, onClose }) {
  const { control, handleSubmit, reset, formState } = useForm({ defaultValues: toValues(category), mode: "onTouched" });

  useEffect(() => {
    if (open) {
      reset(toValues(category));
    }
  }, [open, category, reset]);

  const submit = (values) =>
    onSubmit({ name: values.name.trim(), description: values.description.trim(), image: values.image.trim() });

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit(submit)} noValidate>
        <DialogTitle fontWeight={800}>{category ? "Edit category" : "New category"}</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ pt: 1 }}>
            <FormTextField name="name" control={control} rules={lengthRules("Name", 3, 100)} label="Name" disabled={loading} />
            <FormTextField
              name="description"
              control={control}
              rules={{ maxLength: { value: 500, message: "Description cannot exceed 500 characters." } }}
              label="Description"
              multiline
              minRows={3}
              disabled={loading}
            />
            <FormTextField
              name="image"
              control={control}
              rules={{ maxLength: { value: 500, message: "Image URL cannot exceed 500 characters." } }}
              label="Image URL (optional)"
              disabled={loading}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <SubmitButton loading={loading} disabled={loading || (category && !formState.isDirty)} size="medium" loadingText="Saving...">
            {category ? "Save changes" : "Create category"}
          </SubmitButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CategoryFormDialog;
