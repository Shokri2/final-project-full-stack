import { Alert, Box, Card, CardContent, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import PageHeader from "../../Components/Common/PageHeader";
import FormPasswordField from "../../Components/Form/FormPasswordField";
import SubmitButton from "../../Components/Form/SubmitButton";
import PasswordStrength from "../../Components/Auth/PasswordStrength";
import { passwordRules, requiredRule } from "../../Components/Form/rules";
import { useAsyncAction } from "../../Hooks/useAsyncAction";
import { changePassword } from "../../api/usersApi";
import { applyFieldErrors, getErrorMessage } from "../../utils/errors";

const emptyForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

function ChangePassword() {
  const { run, pending } = useAsyncAction();

  const { control, handleSubmit, watch, reset, setError } = useForm({
    defaultValues: emptyForm,
    mode: "onTouched",
  });

  const currentPassword = watch("currentPassword");
  const newPassword = watch("newPassword");

  const onSubmit = (values) =>
    run(() => changePassword(values), {
      success: "Password changed. Other devices have been signed out.",
      onSuccess: () => reset(emptyForm),
      onError: (error) => {
        if (applyFieldErrors(error, setError)) {
          return true;
        }

        if (error?.response?.status === 400) {
          setError("currentPassword", { type: "server", message: getErrorMessage(error) });
          return true;
        }

        return false;
      },
    });

  return (
    <>
      <PageHeader title="Change password" subtitle="Use a strong password you don't use anywhere else." />

      <Card elevation={0} sx={{ border: 1, borderColor: "divider", borderRadius: 3, maxWidth: 620 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            After changing your password, you will stay signed in here and be signed out on other devices.
          </Alert>

          <Stack component="form" spacing={1} onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormPasswordField
              name="currentPassword"
              control={control}
              rules={requiredRule("Current password")}
              label="Current password"
              autoComplete="current-password"
              disabled={pending}
            />
            <FormPasswordField
              name="newPassword"
              control={control}
              rules={{
                ...passwordRules,
                validate: (value) => value !== currentPassword || "New password must be different from the current one.",
              }}
              label="New password"
              autoComplete="new-password"
              disabled={pending}
              helperText="At least 8 characters with a letter and a number."
            />
            <PasswordStrength password={newPassword} />
            <FormPasswordField
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm the new password.",
                validate: (value) => value === newPassword || "Passwords do not match.",
              }}
              label="Confirm new password"
              autoComplete="new-password"
              disabled={pending}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <SubmitButton loading={pending} loadingText="Updating...">
                Update password
              </SubmitButton>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

export default ChangePassword;
