import Box from "@mui/material/Box";
import { Slide } from "react-awesome-reveal";
import Grid from "@mui/material/Grid";
import Card from "./card";
import styles from "./styles";
import { CAPABILITY_GROUPS } from "../../../utils/constants";
import { fadeDuration } from "../../../utils/constants";

const Skills = () => {
  return (
    <Grid container direction="row" sx={styles.cards}>
      {CAPABILITY_GROUPS.map(({ title, skills, icon }, i) => {
        return (
          <Grid size={{ xs: 12, md: 6 }} key={i} sx={styles.cardCell}>
            <Slide duration={fadeDuration} direction="right" triggerOnce>
              <Box sx={styles.cardContainer}>
                <Card title={title} skills={skills} icon={icon} />
              </Box>
            </Slide>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Skills;
