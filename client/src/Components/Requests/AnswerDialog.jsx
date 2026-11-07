import { useEffect } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useForm } from "react-hook-form";
import FormTextField from "../Form/FormTextField";
import SubmitButton from "../Form/SubmitButton";
import { lengthRules } from "../Form/rules";

function AnswerDialog({ open, request, loading, onSubmit, onClose }) {
  const { control, handleSubmit, reset } = useForm({ defaultValues: { response: "", note: "" }, mode: "onTouched" });

  useEffect(() => {
    if (open) {
      reset({ response: "", note: "" });
    }
  }, [open, reset]);

  const submit = (values) =>
    onSubmit({ response: values.response.trim(), ...(values.note.trim() ? { note: values.note.trim() } : {}) });

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="md">
      <Box component="form" onSubmit={handleSubmit(submit)} noValidate>
        <DialogTitle fontWeight={800}>Answer: {request.title}</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            The farmer will see this answer immediately. Be specific: diagnosis, treatment steps and what to watch for.
          </Alert>
          <FormTextField
            name="response"
            control={control}
            rules={lengthRules("Answer", 20, 10000)}
            label="Your answer"
            multiline
            minRows={8}
            disabled={loading}
            autoFocus
          />
          <FormTextField
            name="note"
            control={control}
            rules={{ maxLength: { value: 1000, message: "Note cannot exceed 1000 characters." } }}
            label="Internal note for the history (optional)"
            disabled={loading}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <SubmitButton loading={loading} size="medium" loadingText="Sending...">
            Send answer
          </SubmitButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default AnswerDialog;
