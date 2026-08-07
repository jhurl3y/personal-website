import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SmoothAnchor from "./smoothAnchor";

/**
 * Scroll targeting has broken twice: once when navHeight was undefined so the
 * Section offsets never applied, and once when the 40px fudge that compensated
 * for it was left behind and overshot. These pin the arithmetic.
 */

const NAV_HEIGHT = 93;
let scrollSpy: ReturnType<typeof vi.fn>;

/**
 * A section positioned like the real ones: `marginTop:-navHeight` and
 * `paddingTop:navHeight`, so its box top is navHeight above its content.
 */
const mountSection = (id: string, boxTopInViewport: number) => {
  const el = document.createElement("div");
  el.id = id;
  el.getBoundingClientRect = () =>
    ({
      top: boxTopInViewport,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: boxTopInViewport,
      toJSON: () => ({}),
    }) as DOMRect;
  document.body.appendChild(el);
  return el;
};

beforeEach(() => {
  scrollSpy = vi.fn();
  window.scroll = scrollSpy as unknown as typeof window.scroll;
  Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches: false,
  } as MediaQueryList);
});

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe("smoothAnchor", () => {
  it("scrolls to the section box top, with no fudge factor", async () => {
    // Regression guard: a hard-coded -40 here left every section 40px low.
    mountSection("about", 1200);
    const user = userEvent.setup();
    render(<SmoothAnchor href="#about">about</SmoothAnchor>);

    await user.click(screen.getByText("about"));

    expect(scrollSpy).toHaveBeenCalledWith(
      expect.objectContaining({ top: 1200 })
    );
  });

  it("accounts for the current scroll position", async () => {
    Object.defineProperty(window, "scrollY", { value: 500, writable: true });
    mountSection("about", 700);
    const user = userEvent.setup();
    render(<SmoothAnchor href="#about">about</SmoothAnchor>);

    await user.click(screen.getByText("about"));

    // 700 in-viewport + 500 already scrolled = 1200 absolute.
    expect(scrollSpy).toHaveBeenCalledWith(
      expect.objectContaining({ top: 1200 })
    );
  });

  it("subtracts a numeric offset", async () => {
    mountSection("about", 1200);
    const user = userEvent.setup();
    render(
      <SmoothAnchor href="#about" offset={NAV_HEIGHT}>
        about
      </SmoothAnchor>
    );

    await user.click(screen.getByText("about"));

    expect(scrollSpy).toHaveBeenCalledWith(
      expect.objectContaining({ top: 1200 - NAV_HEIGHT })
    );
  });

  it("accepts a function offset, so it can be measured at click time", async () => {
    mountSection("about", 1200);
    const user = userEvent.setup();
    render(
      <SmoothAnchor href="#about" offset={() => 60}>
        about
      </SmoothAnchor>
    );

    await user.click(screen.getByText("about"));

    expect(scrollSpy).toHaveBeenCalledWith(
      expect.objectContaining({ top: 1140 })
    );
  });

  it("animates by default", async () => {
    mountSection("about", 100);
    const user = userEvent.setup();
    render(<SmoothAnchor href="#about">about</SmoothAnchor>);

    await user.click(screen.getByText("about"));

    expect(scrollSpy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" })
    );
  });

  // window.scroll({behavior:"smooth"}) ignores the CSS scroll-behavior
  // override, so this has to be checked in JS or reduced motion is not honoured.
  it("jumps instantly when reduced motion is preferred", async () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
    } as MediaQueryList);
    mountSection("about", 100);
    const user = userEvent.setup();
    render(<SmoothAnchor href="#about">about</SmoothAnchor>);

    await user.click(screen.getByText("about"));

    expect(scrollSpy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "auto" })
    );
  });

  it("does nothing when the target does not exist", async () => {
    const user = userEvent.setup();
    render(<SmoothAnchor href="#missing">missing</SmoothAnchor>);

    await user.click(screen.getByText("missing"));

    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it("still calls a supplied onClick", async () => {
    mountSection("about", 100);
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <SmoothAnchor href="#about" onClick={onClick}>
        about
      </SmoothAnchor>
    );

    await user.click(screen.getByText("about"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not leak offset or extraScroll onto the DOM node", () => {
    mountSection("about", 100);
    render(
      <SmoothAnchor href="#about" offset={40} extraScroll>
        about
      </SmoothAnchor>
    );

    const link = screen.getByText("about");
    expect(link).not.toHaveAttribute("offset");
    expect(link).not.toHaveAttribute("extraScroll");
  });
});
