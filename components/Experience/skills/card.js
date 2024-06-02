import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Styles from "./styles";

export default ({ title, content, icon }) => {
  const classes = Styles();

  return (
    <Card className={classes.card} raised>
      <CardContent>
        {icon()}
        <Typography
          className={classes.cardTitle}
          color="textPrimary"
          gutterBottom
        >
          {title}
        </Typography>
        <div
          className={classes.cardContent}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
    </Card>
  );
};
