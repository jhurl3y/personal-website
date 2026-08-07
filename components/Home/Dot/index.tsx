import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import styles from "../styles";

type DotProps = {
  i: number;
  highlight: boolean;
  onDotClick: (i: number) => void;
};

const Dot = ({ i, highlight, onDotClick }: DotProps) => (
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
          backgroundColor: highlight
            ? theme.vars!.palette.text.primary
            : theme.vars!.palette.text.secondary,
        }),
      ]}
    >
      {""}
    </Box>
  </Button>
);

export default Dot;
