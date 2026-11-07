import { Alert, Link as MuiLink, Stack, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../Hooks/useAuth";
import AuthLayout from "./AuthLayout";
import FormTextField from "../Form/FormTextField";
import FormPasswordField from "../Form/FormPasswordField";
import SubmitButton from "../Form/SubmitButton";
import { emailRules, requiredRule } from "../Form/rules";
import { applyFieldErrors } from "../../utils/errors";

function Login() {
  const location = useLocation();
  const { login, loading } = useAuth();

  const { control, handleSubmit, setError } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values) => {
    const result = await login({ email: values.email.trim().toLowerCase(), password: values.password });

    if (result?.error) {
      applyFieldErrors(result.error, setError);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to follow your consultations and crops."
      footer={
        <Typography color="text.secondary">
          Don't have an account?{" "}
          <MuiLink component={Link} to="/register" fontWeight={700} underline="hover">
            Create account
          </MuiLink>
        </Typography>
      }
    >
      {location.state?.from && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Please log in to continue.
        </Alert>
      )}

      <Stack component="form" spacing={1} onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormTextField
          name="email"
          control={control}
          rules={emailRules}
          label="Email address"
          type="email"
          autoComplete="email"
          disabled={loading}
        />
        <FormPasswordField
          name="password"
          control={control}
          rules={requiredRule("Password")}
          label="Password"
          autoComplete="current-password"
          disabled={loading}
        />
        <SubmitButton loading={loading} loadingText="Signing in..." fullWidth sx={{ py: 1.4 }}>
          Sign in
        </SubmitButton>
      </Stack>

      <Typography color="text.secondary" fontSize={14} sx={{ mt: 2, textAlign: "center" }}>
        Didn't get the verification email?{" "}
        <MuiLink component={Link} to="/verify-email" underline="hover">
          Resend it
        </MuiLink>
      </Typography>
    </AuthLayout>
  );
}

export default Login;
