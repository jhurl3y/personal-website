import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { useTheme } from "@mui/material/styles";
import { experience } from "../../../utils/constants";
import { Work, School } from "@mui/icons-material";

const Timeline = () => {
  const theme = useTheme();

  const timelineContent = experience.map((position, i) => {
    const { color, type, date, title, location, tasks, skills } = position;

    return (
      <VerticalTimelineElement
        key={i}
        // Cards were a hardcoded #2194f3, which clashed badly with the slate
        // section behind them. Limestone cards with ink text give 14.83:1 and
        // read as deliberate against the dark background.
        contentStyle={{
          background: theme.vars!.palette.background.paper,
          color: theme.vars!.palette.text.primary,
          boxShadow: "none",
        }}
        contentArrowStyle={{
          borderRight: `7px solid ${theme.vars!.palette.background.paper}`,
        }}
        date={date}
        // `color` is the employer's brand mark, so it stays as-is - it carries
        // information the palette shouldn't flatten.
        iconStyle={{ background: color, color: theme.vars!.palette.chalk }}
        icon={type == "work" ? <Work /> : <School />}
      >
        <div>
          <h3>{title}</h3>
          <h4>{location}</h4>
          <p>{tasks}</p>
          {skills && <p>{skills}</p>}
        </div>
      </VerticalTimelineElement>
    );
  });

  return (
    <div
      style={{
        ["--route-line" as string]: theme.vars!.palette.seaGlass,
        width: "100%",
      }}
    >
      <VerticalTimeline lineColor={theme.vars!.palette.seaGlass}>
        {timelineContent}
      </VerticalTimeline>
    </div>
  );
};

export default Timeline;
