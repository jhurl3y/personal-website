// react-vertical-timeline-component ships no types. A local declaration is
// preferable to a blanket @ts-ignore: it covers only the props this project
// actually uses, so a genuine misuse is still caught.
declare module "react-vertical-timeline-component" {
  import type { CSSProperties, ReactNode } from "react";

  export type VerticalTimelineElementProps = {
    children?: ReactNode;
    date?: string;
    icon?: ReactNode;
    iconStyle?: CSSProperties;
    contentStyle?: CSSProperties;
    contentArrowStyle?: CSSProperties;
    className?: string;
  };

  export type VerticalTimelineProps = {
    children?: ReactNode;
    animate?: boolean;
    className?: string;
    layout?: "1-column" | "1-column-left" | "1-column-right" | "2-columns";
    lineColor?: string;
  };

  export const VerticalTimeline: React.FC<VerticalTimelineProps>;
  export const VerticalTimelineElement: React.FC<VerticalTimelineElementProps>;
}
