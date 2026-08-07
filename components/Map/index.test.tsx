import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MapContainer from "./index";
import { LOCATIONS } from "../../utils/constants";

// useJsApiLoader is a hook, so it cannot be called conditionally. The guard
// therefore has to live in a child that is only mounted when a key exists -
// these check that the request is genuinely never made, not merely hidden.
const useJsApiLoader = vi.fn(() => ({ isLoaded: true }));

vi.mock("@react-google-maps/api", () => ({
  useJsApiLoader: (...args: unknown[]) => useJsApiLoader(...(args as [])),
  GoogleMap: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="google-map">{children}</div>
  ),
  Polyline: () => <div data-testid="polyline" />,
}));

const renderMap = (apiKey: string | null) =>
  render(
    <MapContainer
      location={{ lat: 53.27, lng: -9.057 }}
      zoom={13}
      title="contact-map"
      apiKey={apiKey}
    />
  );

describe("with no API key", () => {
  it("lists the cities instead of the map", () => {
    renderMap(null);
    for (const { name } of LOCATIONS) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("never mounts the Google loader", () => {
    useJsApiLoader.mockClear();
    renderMap(null);
    expect(useJsApiLoader).not.toHaveBeenCalled();
    expect(screen.queryByTestId("google-map")).not.toBeInTheDocument();
  });
});

describe("with an API key", () => {
  it("mounts the map and not the fallback", () => {
    useJsApiLoader.mockClear();
    renderMap("a-key");
    expect(useJsApiLoader).toHaveBeenCalled();
    expect(screen.getByTestId("google-map")).toBeInTheDocument();
    expect(screen.queryByText(LOCATIONS[0].name)).not.toBeInTheDocument();
  });
});
