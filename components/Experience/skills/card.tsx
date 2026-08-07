import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import styles from "./styles";

type SkillCardProps = {
  title: string;
  content: string;
  icon: ReactNode;
};

const SkillCard = ({ title, content, icon }: SkillCardProps) => {
  return (
    <Card sx={styles.card} elevation={0}>
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
