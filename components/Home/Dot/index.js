import Button from "@mui/material/Button";
import { COLORS } from "../../../utils/constants";

const Dot = ({ i, highlight, onDotClick, classes }) => (
  <Button
    onClick={() => onDotClick(i)}
    className={classes.dotContainer}
    key={i}
    title={`dot-${i}`}
  >
    <span
      className={classes.dot}
      style={{
        backgroundColor: `${highlight ? COLORS.white : COLORS.mediumGrey}`,
      }}
    >
      {""}
    </span>
  </Button>
);

export default Dot;
