import { Link as MuiLink, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../Hooks/useAuth";
import AuthLayout from "./AuthLayout";
import FormTextField from "../Form/FormTextField";
import FormPasswordField from "../Form/FormPasswordField";
import SubmitButton from "../Form/SubmitButton";
import PasswordStrength from "./PasswordStrength";
import { emailRules, lengthRules, passwordRules, phoneRules } from "../Form/rules";
import { applyFieldErrors } from "../../utils/errors";

function Register() {
  const { register, loading } = useAuth();

  const { control, handleSubmit, setError, watch } = useForm({
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  const password = watch("password");

  const onSubmit = async (values) => {
    const result = await register({
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      password: values.password,
      confirmPassword: values.confirmPassword,
    });

    if (result?.error) {
      applyFieldErrors(result.error, setError);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join farmers getting expert advice for their crops."
      footer={
        <Typography color="text.secondary">
          Already have an account?{" "}
          <MuiLink component={Link} to="/login" fontWeight={700} underline="hover">
            Sign in
          </MuiLink>
        </Typography>
      }
    >
      <Stack component="form" spacing={1} onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormTextField
          name="name"
          control={control}
          rules={lengthRules("Name", 3, 50)}
          label="Full name"
          autoComplete="name"
          disabled={loading}
        />
        <FormTextField
          name="email"
          control={control}
          rules={emailRules}
          label="Email address"
          type="email"
          autoComplete="email"
          disabled={loading}
          helperText="We will send a verification link to this email."
        />
        <FormTextField
          name="phone"
          control={control}
          rules={phoneRules}
          label="Phone number (optional)"
          type="tel"
          autoComplete="tel"
          disabled={loading}
        />
        <FormPasswordField
          name="password"
          control={control}
          rules={passwordRules}
          label="Password"
          autoComplete="new-password"
          disabled={loading}
          helperText="At least 8 characters with a letter and a number."
        />
        <PasswordStrength password={password} />
        <FormPasswordField
          name="confirmPassword"
          control={control}
          rules={{
            required: "Please confirm your password.",
            validate: (value) => value === password || "Passwords do not match.",
          }}
          label="Confirm password"
          autoComplete="new-password"
          disabled={loading}
        />
        <SubmitButton loading={loading} loadingText="Creating account..." fullWidth sx={{ py: 1.4 }}>
          Create account
        </SubmitButton>
      </Stack>
    </AuthLayout>
  );
}

export default Register;
