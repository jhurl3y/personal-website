// sx-callback style objects. Replaces the @mui/styles makeStyles module.
// Each entry is `(theme) => ({...})`, which MUI's `sx` prop accepts directly,
// so no hook call is needed at the call site.
const styles = {
  contactDetails: (theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: { flexDirection: "column" },
  }),
  emailPhoneContainer: (theme) => ({
    padding: theme.spacing(2, 8, 8, 8),
    [theme.breakpoints.down("sm")]: { paddingBottom: theme.spacing(6) },
  }),
  emailPhone: (theme) => ({ paddingTop: theme.spacing(4) }),
  mailto: (theme) => ({ color: theme.palette.chalk, textDecoration: "none" }),
  tel: (theme) => ({ color: theme.palette.chalk, textDecoration: "none" }),
};

export default styles;
