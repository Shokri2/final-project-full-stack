import { createTheme } from "@mui/material/styles";

export const buildTheme = (mode) =>
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
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
          containedPrimary: {
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
    },
  });

export const lightTheme = buildTheme("light");

export const darkTheme = buildTheme("dark");
