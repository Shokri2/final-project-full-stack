import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, CircularProgress, Divider, Typography } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import AuthLayout from "../../Components/Auth/AuthLayout";
import ResendVerificationForm from "../../Components/Auth/ResendVerificationForm";
import { verifyEmailRequest } from "../../api/authApi";
import { getErrorMessage } from "../../utils/errors";

function VerifyingState() {
  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <CircularProgress />
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        Verifying your email...
      </Typography>
    </Box>
  );
}

function VerifiedState() {
  return (
    <Box sx={{ textAlign: "center", py: 2 }}>
      <VerifiedOutlinedIcon sx={{ fontSize: 64, color: "success.main" }} />
      <Typography variant="h6" fontWeight={800} sx={{ mt: 1 }}>
        Your email is verified
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        Your account is active. You can sign in now.
      </Typography>
      <Button variant="contained" size="large" component={Link} to="/login" fullWidth>
        Go to login
      </Button>
    </Box>
  );
}

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") ?? "";
  const justRegistered = searchParams.get("registered") === "1";

  const [status, setStatus] = useState(token ? "verifying" : "idle");
  const [error, setError] = useState("");
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) {
      return;
    }

    requested.current = true;

    verifyEmailRequest(token)
      .then(() => setStatus("verified"))
      .catch((requestError) => {
        setError(getErrorMessage(requestError, "This verification link is invalid or has expired."));
        setStatus("failed");
      });
  }, [token]);

  if (status === "verifying") {
    return (
      <AuthLayout title="Email verification">
        <VerifyingState />
      </AuthLayout>
    );
  }

  if (status === "verified") {
    return (
      <AuthLayout title="Email verification">
        <VerifiedState />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={justRegistered ? "Check your inbox" : "Verify your email"}
      subtitle={
        justRegistered
          ? "We sent a verification link to your email. Open it to activate your account."
          : "Enter your email and we will send you a new verification link."
      }
      footer={
        <Button component={Link} to="/login" color="inherit">
          Back to login
        </Button>
      }
    >
      {status === "failed" && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error} Request a new link below.
        </Alert>
      )}

      {justRegistered && (
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <MarkEmailReadOutlinedIcon sx={{ fontSize: 56, color: "primary.main" }} />
          {email && (
            <Typography fontWeight={700} sx={{ mt: 1, wordBreak: "break-all" }}>
              {email}
            </Typography>
          )}
          <Divider sx={{ mt: 3 }}>Didn't receive it?</Divider>
        </Box>
      )}

      <ResendVerificationForm defaultEmail={email} />
    </AuthLayout>
  );
}

export default VerifyEmail;
