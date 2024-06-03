import SmoothAnchor from "../smoothAnchor";

export default ({
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
      sx={(theme) => ({
        marginRight: theme.spacing(7),
        fontSize: "1.375rem",
        color: dark ? "#fff" : "#000",
      })}
      extraScroll={extraScroll}
    >
      {text}
    </SmoothAnchor>
  );
};
