import { IconButton, Tooltip } from "@mui/material";
import { useThemeMode } from "../../Context/ThemeContext.jsx";

export default function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Tooltip
      title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <IconButton
        onClick={toggleTheme}
        color="primary"
        aria-label="Toggle light and dark mode"
      >
        {mode === "light" ? "🌙" : "☀️"}
      </IconButton>
    </Tooltip>
  );
}
