import SmoothAnchor from "../smoothAnchor";
import Styles from "./styles";

const PrettyLink = ({
  href,
  text,
  title = "",
  dark = true,
  active = false,
  extraScroll = false,
}) => {
  const classes = Styles();

  return (
    <SmoothAnchor
      variant="body2"
      underline={active ? "always" : "hover"}
      href={href}
      title={title}
      className={dark ? classes.darkLink : classes.lightLink}
      extraScroll={extraScroll}
    >
      {text}
    </SmoothAnchor>
  );
};

export default PrettyLink;
