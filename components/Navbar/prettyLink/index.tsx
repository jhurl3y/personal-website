import SmoothAnchor from "../smoothAnchor";
import styles from "./styles";

type PrettyLinkProps = {
  href: string;
  text: string;
  title?: string;
  dark?: boolean;
  active?: boolean;
  extraScroll?: boolean;
};

const PrettyLink = ({
  href,
  text,
  title = "",
  dark = true,
  active = false,
  extraScroll = false,
}: PrettyLinkProps) => {
  return (
    <SmoothAnchor
      variant="body2"
      underline={active ? "always" : "hover"}
      href={href}
      title={title}
      sx={dark ? styles.darkLink : styles.lightLink}
      extraScroll={extraScroll}
    >
      {text}
    </SmoothAnchor>
  );
};

export default PrettyLink;
