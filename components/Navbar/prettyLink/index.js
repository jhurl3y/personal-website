import SmoothAnchor from "../smoothAnchor";
import styles from "./styles";

const PrettyLink = ({
  href,
  text,
  title = "",
  dark = true,
  active = false,
  extraScroll = false,
}) => {
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
