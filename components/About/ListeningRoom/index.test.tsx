import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import ListeningRoom from "./index";
import theme from "../../../src/theme";
import { FEATURED_PLAYLIST } from "../../../utils/constants";

vi.mock("react-spotify-embed", () => ({
  Spotify: ({ link, title }: { link: string; title: string }) => (
    <iframe src={link} title={title} />
  ),
}));

const renderListeningRoom = () =>
  render(
    <ThemeProvider theme={theme} defaultMode="light">
      <ListeningRoom playlist={FEATURED_PLAYLIST} />
    </ThemeProvider>
  );

describe("ListeningRoom", () => {
  it("does not mount Spotify until requested", () => {
    renderListeningRoom();

    expect(screen.queryByTitle(/Spotify/)).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /open in spotify/i })
    ).toHaveAttribute("href", FEATURED_PLAYLIST.href);
  });

  it("mounts one player and can hide it again", async () => {
    renderListeningRoom();

    fireEvent.click(screen.getByRole("button", { name: /play here/i }));
    expect(screen.getByTitle(/Spotify/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /hide player/i })
    ).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(screen.getByRole("button", { name: /hide player/i }));
    await waitFor(() =>
      expect(screen.queryByTitle(/Spotify/)).not.toBeInTheDocument()
    );
  });
});
