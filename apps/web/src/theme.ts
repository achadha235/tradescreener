// import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";
import { createTheme, lighten } from "@mui/material";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config.js";

const tw = resolveConfig(tailwindConfig) as any;
const { primary, secondary, text, background } = tw.theme.colors;
const fontFamily = "'Hind Madurai', sans-serif";

export const themeOptions = createTheme({
  components: {
    MuiSlider: {
      styleOverrides: {
        mark: {
          height: 25,
          width: 4,
          backgroundColor: "blue",
          opacity: 1,
          outline: "solid 1px lightblue",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          padding: 10,
          borderRadius: 5,
          backgroundColor: tw.theme.colors.highlight,
          border: "solid 2px",
          borderColor: lighten(tw.theme.colors.highlight, 0.8),
        },
      },
    },
  },
  palette: {
    primary,
    secondary,
    text,
    background,
  },
  typography: {
    fontFamily,
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 600,
  },
});
