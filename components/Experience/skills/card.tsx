import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import styles from "./styles";

type SkillCardProps = {
  title: string;
  icon: ReactNode;
  skills: { title: string; content: string }[];
};

const SkillCard = ({ title, skills, icon }: SkillCardProps) => {
  return (
    <Card sx={styles.card} elevation={0}>
      <CardContent>
        {icon}
        <Typography sx={styles.cardTitle} color="textPrimary" gutterBottom>
          {title}
        </Typography>
        <Box sx={styles.tags}>
          {skills.map((skill) => (
            <Box component="span" key={skill.title} sx={styles.tag}>
              {skill.title}
            </Box>
          ))}
        </Box>
        <Box sx={styles.skillDetails}>
          {skills.map((skill) => (
            <Box key={skill.title} sx={styles.skillDetail}>
              <Typography component="h4" sx={styles.skillTitle}>
                {skill.title}
              </Typography>
              <Box
                sx={styles.cardContent}
                dangerouslySetInnerHTML={{ __html: skill.content }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SkillCard;
