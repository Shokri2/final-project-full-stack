import { useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import FormTextField from "../Form/FormTextField";
import FormSelect from "../Form/FormSelect";
import SubmitButton from "../Form/SubmitButton";
import { lengthRules } from "../Form/rules";

const ratingLabels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

function FeedbackDialog({ open, title, subtitle, initialValues, cropOptions, loading, onSubmit, onClose }) {
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: { rating: 0, comment: "", crop_id: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    if (open) {
      reset({ rating: 0, comment: "", crop_id: "", ...initialValues });
    }
  }, [open, initialValues, reset]);

  const rating = watch("rating");

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle fontWeight={800}>{title}</DialogTitle>
        <DialogContent>
          {subtitle && (
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {subtitle}
            </Typography>
          )}
          <Stack spacing={1}>
            {cropOptions && (
              <FormSelect
                name="crop_id"
                control={control}
                label="Crop (optional)"
                options={[{ value: "", label: "General feedback about the platform" }, ...cropOptions]}
                disabled={loading}
              />
            )}
            <Controller
              name="rating"
              control={control}
              rules={{ validate: (value) => value >= 1 || "Please choose a rating." }}
              render={({ field, fieldState }) => (
                <Box>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <Rating
                      value={field.value}
                      onChange={(_, value) => field.onChange(value ?? 0)}
                      size="large"
                      disabled={loading}
                    />
                    <Typography color="text.secondary">{ratingLabels[rating]}</Typography>
                  </Stack>
                  <FormHelperText error={Boolean(fieldState.error)}>{fieldState.error?.message ?? " "}</FormHelperText>
                </Box>
              )}
            />
            <FormTextField
              name="comment"
              control={control}
              rules={lengthRules("Comment", 10, 2000)}
              label="Your review"
              multiline
              minRows={4}
              disabled={loading}
              helperText="Your review will be public after our team approves it."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <SubmitButton loading={loading} size="medium" loadingText="Sending...">
            Submit review
          </SubmitButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default FeedbackDialog;
