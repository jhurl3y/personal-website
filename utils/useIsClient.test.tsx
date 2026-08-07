import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { useIsClient } from "./useIsClient";

const Probe = () => <span>{useIsClient() ? "client" : "server"}</span>;

describe("useIsClient", () => {
  // The whole point: the server snapshot must be false, or the age and
  // copyright year would render at build time and go stale.
  it("is false when server-rendered", () => {
    expect(renderToString(<Probe />)).toContain("server");
  });

  it("is true once mounted in the browser", () => {
    render(<Probe />);
    expect(screen.getByText("client")).toBeInTheDocument();
  });
});
