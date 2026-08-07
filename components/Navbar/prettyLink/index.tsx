import SmoothAnchor from "../smoothAnchor";
import styles from "./styles";
import type { NavbarSurface } from "..";

type PrettyLinkProps = {
  href: string;
  text: string;
  title?: string;
  surface?: NavbarSurface;
  active?: boolean;
  extraScroll?: boolean;
};

const PrettyLink = ({
  href,
  text,
  title = "",
  surface = "overlay",
  active = false,
  extraScroll = false,
}: PrettyLinkProps) => {
  return (
    <SmoothAnchor
      variant="body2"
      underline={active ? "always" : "hover"}
      href={href}
      title={title}
      sx={surface === "overlay" ? styles.overlayLink : styles.solidLink}
      extraScroll={extraScroll}
    >
      {text}
    </SmoothAnchor>
  );
};

export default PrettyLink;
