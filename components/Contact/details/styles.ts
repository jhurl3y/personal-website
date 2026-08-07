import type { Theme } from "@mui/material/styles";

// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme: Theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  contactDetails: (theme: Theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: { flexDirection: "column" },
  }),
  emailPhoneContainer: (theme: Theme) => ({
    padding: theme.spacing(2, 8, 8, 8),
    [theme.breakpoints.down("sm")]: { paddingBottom: theme.spacing(6) },
  }),
  emailPhone: (theme: Theme) => ({ paddingTop: theme.spacing(4) }),
  mailto: (theme: Theme) => ({
    color: theme.palette.chalk,
    textDecoration: "none",
  }),
  tel: (theme: Theme) => ({
    color: theme.palette.chalk,
    textDecoration: "none",
  }),
};

export default styles;
