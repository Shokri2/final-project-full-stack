import { useEffect } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import FormTextField from "../../Form/FormTextField";
import FormPasswordField from "../../Form/FormPasswordField";
import FormSelect from "../../Form/FormSelect";
import SubmitButton from "../../Form/SubmitButton";
import { emailRules, lengthRules, passwordRules, phoneRules } from "../../Form/rules";
import { ROLE_OPTIONS } from "./userColumns";

const empty = { name: "", email: "", phone: "", password: "", role: "user", specialties: [] };

function CreateUserDialog({ open, categoryOptions, loading, onSubmit, onClose, setErrorRef }) {
  const { control, handleSubmit, reset, watch, setError } = useForm({ defaultValues: empty, mode: "onTouched" });
  const role = watch("role");

  useEffect(() => {
    if (open) {
      reset(empty);
    }
  }, [open, reset]);

  useEffect(() => {
    if (setErrorRef) {
      setErrorRef.current = setError;
    }
  }, [setError, setErrorRef]);

  const submit = (values) =>
    onSubmit({
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      role: values.role,
      ...(values.phone.trim() ? { phone: values.phone.trim() } : {}),
      ...(values.role === "agronomist" ? { specialties: values.specialties } : {}),
    });

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit(submit)} noValidate>
        <DialogTitle fontWeight={800}>Create user</DialogTitle>
        <DialogContent>
          <Grid container spacing={1} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormTextField name="name" control={control} rules={lengthRules("Name", 3, 50)} label="Full name" disabled={loading} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormSelect name="role" control={control} label="Role" options={ROLE_OPTIONS} disabled={loading} />
            </Grid>
            <Grid size={12}>
              <FormTextField name="email" control={control} rules={emailRules} label="Email" type="email" disabled={loading} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormTextField name="phone" control={control} rules={phoneRules} label="Phone (optional)" disabled={loading} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormPasswordField
                name="password"
                control={control}
                rules={passwordRules}
                label="Temporary password"
                autoComplete="new-password"
                disabled={loading}
              />
            </Grid>
            {role === "agronomist" && (
              <Grid size={12}>
                <FormSelect
                  name="specialties"
                  control={control}
                  label="Specialties"
                  options={categoryOptions}
                  multiple
                  disabled={loading}
                  helperText="Requests are assigned to agronomists by these categories."
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <SubmitButton loading={loading} size="medium" loadingText="Creating...">
            Create user
          </SubmitButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CreateUserDialog;
