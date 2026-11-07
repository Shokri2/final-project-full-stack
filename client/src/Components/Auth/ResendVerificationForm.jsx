import { useEffect, useState } from "react";
import { Alert, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { resendVerificationRequest } from "../../api/authApi";
import { useAsyncAction } from "../../Hooks/useAsyncAction";
import FormTextField from "../Form/FormTextField";
import SubmitButton from "../Form/SubmitButton";
import { emailRules } from "../Form/rules";

const COOLDOWN_SECONDS = 60;

function ResendVerificationForm({ defaultEmail = "" }) {
  const { run, pending } = useAsyncAction();
  const [cooldown, setCooldown] = useState(0);
  const [sent, setSent] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: { email: defaultEmail },
    mode: "onTouched",
  });

  useEffect(() => {
    if (cooldown <= 0) {
      return undefined;
    }

    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const onSubmit = (values) =>
    run(() => resendVerificationRequest(values.email.trim().toLowerCase()), {
      onSuccess: () => {
        setSent(true);
        setCooldown(COOLDOWN_SECONDS);
      },
    });

  return (
    <Stack component="form" spacing={1} onSubmit={handleSubmit(onSubmit)} noValidate>
      {sent && (
        <Alert severity="success" sx={{ mb: 1 }}>
          If the account exists and is not verified yet, a new link is on its way. Check your inbox and spam folder.
        </Alert>
      )}
      <FormTextField
        name="email"
        control={control}
        rules={emailRules}
        label="Email address"
        type="email"
        autoComplete="email"
        disabled={pending}
      />
      <SubmitButton
        loading={pending}
        disabled={pending || cooldown > 0}
        loadingText="Sending..."
        variant="outlined"
        fullWidth
      >
        {cooldown > 0 ? `Resend available in ${cooldown}s` : "Send verification link"}
      </SubmitButton>
    </Stack>
  );
}

export default ResendVerificationForm;
