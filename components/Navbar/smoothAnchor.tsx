import React, { Component } from "react";
import Link from "@mui/material/Link";
import type { LinkProps } from "@mui/material/Link";

type Offset = number | string | (() => number);

type SmoothAnchorProps = LinkProps & {
  /** Pixels to leave above the target, or a function returning them. */
  offset?: Offset;
  /**
   * Fires a second scroll 200ms later. Safari scrolls faster than Chrome for
   * long jumps, which starves the Navbar's scroll handler of the events it
   * needs to update the active page. See the note in smoothScroll.
   */
  extraScroll?: boolean;
};

class SmoothAnchor extends Component<SmoothAnchorProps> {
  constructor(props: SmoothAnchorProps) {
    super(props);
    this.smoothScroll = this.smoothScroll.bind(this);
  }

  smoothScroll(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    let offset = () => 0;

    if (typeof this.props.offset !== "undefined") {
      if (typeof this.props.offset === "function") {
        offset = this.props.offset;
      } else {
        const raw = this.props.offset;
        offset = () => parseInt(String(raw), 10);
      }
    }

    const href = e.currentTarget.getAttribute("href");
    if (!href) return;

    const anchor = document.getElementById(href.slice(1));
    if (!anchor) return;

    // No fudge factor here. Each Section already carries marginTop:-navHeight
    // and paddingTop:navHeight, so landing its box at viewport 0 puts the
    // content exactly under the sticky navbar. The hard-coded -40 this
    // replaces predated bug 7.1, when navHeight was always undefined and the
    // Section offsets never applied - it was compensating for a broken
    // measurement, and once that was fixed it overshot by 40px.
    const offsetTop = anchor.getBoundingClientRect().top + window.scrollY;

    // window.scroll({behavior:"smooth"}) is unaffected by the CSS
    // scroll-behavior override, so reduced motion is checked explicitly.
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";

    window.scroll({ top: offsetTop - offset(), behavior });

    this.props.onClick?.(e);

    // Safari scrolls much quicker than Chrome when an href further down the
    // page is clicked. The Navbar's handleScroll only runs a few times and so
    // never settles on the right active page. Firing an extra scroll forces it
    // to run again. A hack; worth replacing with an IntersectionObserver.
    if (this.props.extraScroll) {
      setTimeout(() => {
        window.scroll({ top: offsetTop, behavior });
      }, 200);
    }
  }

  render() {
    // offset and extraScroll are consumed here, not forwarded to the DOM.
    const { offset: _offset, extraScroll: _extraScroll, ...rest } = this.props;
    return <Link {...rest} onClick={this.smoothScroll} />;
  }
}

export default SmoothAnchor;
