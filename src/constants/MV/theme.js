import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00A9BF",
    },
    secondary: {
      main: "#009444",
    },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
  },
  // direction: 'rtl'
});

export default theme;
