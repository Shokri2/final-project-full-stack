import { createContext, useContext, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

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
      return localStorage.getItem("alhasad-theme") === "dark"
        ? "dark"
        : "light";
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
      }

      return newMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#246B3D" : "#8BD49D",
            contrastText: mode === "light" ? "#FFFFFF" : "#102A1D",
          },
          secondary: {
            main: "#D9F36A",
            contrastText: "#183D2A",
          },
          background: {
            default: mode === "light" ? "#F7FAF5" : "#101813",
            paper: mode === "light" ? "#FFFFFF" : "#1B2720",
          },
          text: {
            primary: mode === "light" ? "#183D2A" : "#F0F5F0",
            secondary: mode === "light" ? "#52665A" : "#B5C5B9",
          },
          divider: mode === "light" ? "#DCE5DC" : "#35463A",
        },
        shape: {
          borderRadius: 12,
        },
        typography: {
          fontFamily: "Arial, sans-serif",
          button: {
            textTransform: "none",
            fontWeight: 600,
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: mode === "light" ? "#F7FAF5" : "#101813",
                color: mode === "light" ? "#183D2A" : "#F0F5F0",
                transition: "background-color 0.25s ease, color 0.25s ease",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [mode],
  );

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
