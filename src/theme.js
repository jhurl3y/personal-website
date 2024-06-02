import { createTheme, responsiveFontSizes } from "@mui/material";
import { COLORS } from "../utils/constants";

const theme = responsiveFontSizes(
  createTheme({
    spacing: (factor) => [0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128][factor],
    typography: {
      fontSize: 16,
      fontFamily: ['"Roboto"', "sans-serif"].join(","),
    },
    colors: {
      white: COLORS.white,
      black: COLORS.black,
      blue: COLORS.blue,
      purple: COLORS.purple,
      grey: COLORS.grey,
      darkBlue: COLORS.darkBlue,
      darkGrey: COLORS.darkGrey,
      mediumGrey: COLORS.mediumGrey,
    },
  })
);

export default theme;
