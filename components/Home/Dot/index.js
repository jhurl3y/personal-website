import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import styles from "../styles";

const Dot = ({ i, highlight, onDotClick }) => (
  <Button
    onClick={() => onDotClick(i)}
    sx={styles.dotContainer}
    key={i}
    title={`dot-${i}`}
  >
    <Box
      component="span"
      sx={[
        styles.dot,
        (theme) => ({
          backgroundColor: highlight ? theme.palette.chalk : theme.palette.mist,
        }),
      ]}
    >
      {""}
    </Box>
  </Button>
);

export default Dot;
