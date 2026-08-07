import Box from "@mui/material/Box";
import { Slide } from "react-awesome-reveal";
import Grid from "@mui/material/Grid";
import Card from "./card";
import styles from "./styles";
import { SKILLS } from "../../../utils/constants";
import { fadeDuration } from "../../../utils/constants";

const Skills = () => {
  return (
    <Grid container direction="row" sx={styles.cards}>
      {SKILLS.map(({ title, content, icon }, i) => {
        return (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i} sx={styles.cardCell}>
            <Slide duration={fadeDuration} direction="right" triggerOnce>
              <Box sx={styles.cardContainer}>
                <Card title={title} content={content} icon={icon} />
              </Box>
            </Slide>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Skills;
