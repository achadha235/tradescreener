import { CssBaseline, ThemeProvider } from "@mui/material";
import React, { useMemo } from "react";
import { themeOptions } from "../src/theme";

import "../src/app/globals.css";

const THEMES = {
  light: themeOptions,
  dark: themeOptions,
};

// const preview: Preview = {
//   parameters: {
//     actions: { argTypesRegex: "^on[A-Z].*" },
//     controls: {
//       matchers: {
//         color: /(background|color)$/i,
//         date: /Date$/,
//       },
//     },
//   },
// };
export const withMuiTheme = (Story, context) => {
  // The theme global we just declared
  const { theme: themeKey } = context.globals;

  // only recompute the theme if the themeKey changes
  const theme = useMemo(() => THEMES[themeKey] || THEMES["light"], [themeKey]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  );
};
