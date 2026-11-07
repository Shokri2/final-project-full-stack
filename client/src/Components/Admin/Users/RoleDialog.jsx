import { useEffect } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import FormSelect from "../../Form/FormSelect";
import SubmitButton from "../../Form/SubmitButton";
import { ROLE_OPTIONS } from "./userColumns";

function RoleDialog({ open, user, categoryOptions, specialtiesOnly, loading, onSubmit, onClose }) {
  const defaults = {
    role: user.role,
    specialties: (user.specialties ?? []).map((specialty) => specialty.id),
  };
  const { control, handleSubmit, reset, watch } = useForm({ defaultValues: defaults });
  const role = watch("role");

  useEffect(() => {
    if (open) {
      reset(defaults);
    }
  }, [open, user]);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle fontWeight={800}>{specialtiesOnly ? "Edit specialties" : `Change role of ${user.name}`}</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ pt: 1 }}>
            {!specialtiesOnly && (
              <>
                <Alert severity="warning">The user's permissions change immediately, even in open sessions.</Alert>
                <FormSelect name="role" control={control} label="Role" options={ROLE_OPTIONS} disabled={loading} />
              </>
            )}
            {role === "agronomist" && (
              <FormSelect
                name="specialties"
                control={control}
                label="Specialties"
                options={categoryOptions}
                multiple
                disabled={loading}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <SubmitButton loading={loading} size="medium" loadingText="Saving...">
            Save
          </SubmitButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default RoleDialog;
