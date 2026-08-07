import { useRef } from "react";
import { Transition } from "react-transition-group";
import { TRANSITION_DURATION } from "../../utils/constants";

const baseStyles = {
  transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

const stickyStyles = {
  top: 0,
  height: 0,
  zIndex: 99,
};

export const buildStyles = (sticky, state) => {
  let styles = { ...baseStyles, ...transitionStyles[state] };

  if (sticky) {
    styles = { ...styles, ...stickyStyles };
  }

  return styles;
};

const FadeTransition = (props) => {
  // react-transition-group v4 falls back to ReactDOM.findDOMNode when no
  // nodeRef is supplied. React 19 removed findDOMNode, so without this the
  // navbar throws "findDOMNode is not a function" on the client the first time
  // the transition updates - and it only fails in the browser, never at SSR.
  // 4.4.5 is the latest release, so nodeRef is the fix rather than an upgrade.
  const nodeRef = useRef(null);

  return (
    <Transition in={props.in} timeout={TRANSITION_DURATION} nodeRef={nodeRef}>
      {(state) => (
        <div
          ref={nodeRef}
          className={props.sticky ? "is-sticky" : ""}
          style={buildStyles(props.sticky, state)}
        >
          {props.children}
        </div>
      )}
    </Transition>
  );
};

export default FadeTransition;
