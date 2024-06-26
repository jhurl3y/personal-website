import { Slide } from "react-awesome-reveal";
import Grid from "@mui/material/Grid";
import Card from "./card";
import Styles from "./styles";
import { SKILLS } from "../../../utils/constants";
import { fadeDuration } from "../../../utils/constants";

export default () => {
  const classes = Styles();

  return (
    <Grid container direction="row" className={classes.cards}>
      {SKILLS.map(({ title, content, icon }, i) => {
        return (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Slide duration={fadeDuration} direction="right" triggerOnce>
              <div className={classes.cardContainer}>
                <Card title={title} content={content} icon={icon} />
              </div>
            </Slide>
          </Grid>
        );
      })}
    </Grid>
  );
};
