import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  cards: {
    display: "flex",
    justifyContent: "center",
    paddingBottom: theme.spacing(7),
  },
  cardContainer: {
    height: "100%",
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
  card: {
    margin: theme.spacing(0, 6),
    height: "100%",
    "& ul": {
      listStyleType: "none",
      margin: 0,
      padding: 0,
    },
  },
  cardTitle: {
    fontWeight: 600,
  },
  cardContent: {
    padding: theme.spacing(0, 6),
    listStyleType: "none",
    color: theme.colors.darkGrey,
    paddingBottom: theme.spacing(4),
  },
}));
