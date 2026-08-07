import Box from "@mui/material/Box";
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import styles from "./styles";

const SkillCard = ({ title, content, icon }) => {
  return (
    <Card sx={styles.card} raised>
      <CardContent>
        {icon}
        <Typography sx={styles.cardTitle} color="textPrimary" gutterBottom>
          {title}
        </Typography>
        <Box
          sx={styles.cardContent}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
    </Card>
  );
};

export default SkillCard;
