import { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { buildTheme } from "./theme";

const ThemeModeContext = createContext(null);

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error("useThemeMode must be used inside ThemeModeProvider");
  }

  return context;
};

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem("alhasad-theme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  const toggleTheme = () => {
    setMode((currentMode) => {
      const newMode = currentMode === "light" ? "dark" : "light";

      try {
        localStorage.setItem("alhasad-theme", newMode);
      } catch {
        return newMode;
      }

      return newMode;
    });
  };

  const theme = useMemo(() => buildTheme(mode), [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
      isDarkMode: mode === "dark",
    }),
    [mode],
  );

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
