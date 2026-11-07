import { useMemo } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

const levels = [
  { label: "Too weak", color: "error" },
  { label: "Weak", color: "error" },
  { label: "Fair", color: "warning" },
  { label: "Good", color: "info" },
  { label: "Strong", color: "success" },
];

const scorePassword = (password) => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 0.5;
  if (/[^A-Za-z0-9]/.test(password)) score += 0.5;

  return Math.min(Math.floor(score), 4);
};

function PasswordStrength({ password = "" }) {
  const score = useMemo(() => scorePassword(password), [password]);

  if (!password) {
    return null;
  }

  const level = levels[score];

  return (
    <Box sx={{ mt: -1, mb: 1 }}>
      <LinearProgress
        variant="determinate"
        value={((score + 1) / levels.length) * 100}
        color={level.color}
        sx={{ height: 6, borderRadius: 3 }}
        aria-label="Password strength"
      />
      <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.5 }}>
        Strength: {level.label}
      </Typography>
    </Box>
  );
}

export default PasswordStrength;
