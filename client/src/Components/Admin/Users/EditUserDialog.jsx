import { useEffect } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import FormTextField from "../../Form/FormTextField";
import SubmitButton from "../../Form/SubmitButton";
import { lengthRules, phoneRules } from "../../Form/rules";

const toValues = (user) => ({ name: user.name ?? "", phone: user.phone ?? "" });

function EditUserDialog({ open, user, loading, onSubmit, onClose }) {
  const { control, handleSubmit, reset, formState } = useForm({ defaultValues: toValues(user), mode: "onTouched" });

  useEffect(() => {
    if (open) {
      reset(toValues(user));
    }
  }, [open, user, reset]);

  const submit = (values) => {
    const changes = {};

    if (values.name.trim() !== user.name) {
      changes.name = values.name.trim();
    }

    if (values.phone.trim() && values.phone.trim() !== (user.phone ?? "")) {
      changes.phone = values.phone.trim();
    }

    return onSubmit(changes);
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit(submit)} noValidate>
        <DialogTitle fontWeight={800}>Edit user details</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ pt: 1 }}>
            <FormTextField name="name" control={control} rules={lengthRules("Name", 3, 50)} label="Full name" disabled={loading} />
            <TextField label="Email" value={user.email} disabled fullWidth helperText="Email cannot be changed." />
            <FormTextField name="phone" control={control} rules={phoneRules} label="Phone" type="tel" disabled={loading} />
          </Stack>
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

export default EditUserDialog;
