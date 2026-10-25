import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VideoPlayer } from "../components/VideoPlayer";
import { AudioPlayer } from "../components/AudioPlayer";
import { MediaPlayer } from "../components/MediaPlayer";
import { MediaBar } from "../components/MediaBar";
import { MediaCenter } from "../components/MediaCenter";
import { PlaylistProvider } from "../context/PlaylistContext";

describe("Components Rendering", () => {
  it("renders VideoPlayer with title and controls", () => {
    render(
      <VideoPlayer
        src="https://example.com/test.mp4"
        title="Test Movie"
        subtitle="Test Director"
      />
    );

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("Test Director")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Video Player" })).toBeInTheDocument();
  });

  it("renders AudioPlayer with card variant", () => {
    render(
      <AudioPlayer
        src="https://example.com/song.mp3"
        title="Lofi Track"
        artist="DJ Chill"
        variant="card"
      />
    );

    expect(screen.getByText("Lofi Track")).toBeInTheDocument();
    expect(screen.getByText("DJ Chill")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Audio Player Card" })).toBeInTheDocument();
  });

  it("renders AudioPlayer with compact variant", () => {
    render(
      <AudioPlayer
        src="https://example.com/song.mp3"
        title="Compact Track"
        variant="compact"
      />
    );

    expect(screen.getByText("Compact Track")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Compact Audio Player" })).toBeInTheDocument();
  });

  it("renders MediaPlayer and auto-detects audio format", () => {
    render(
      <MediaPlayer
        src="https://example.com/audio.mp3"
        title="Auto Detected Audio"
        artist="Artist Name"
      />
    );

    expect(screen.getByText("Auto Detected Audio")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Audio Player Card" })).toBeInTheDocument();
  });

  it("renders MediaPlayer and auto-detects video format", () => {
    render(
      <MediaPlayer
        src="https://example.com/video.mp4"
        title="Auto Detected Video"
      />
    );

    expect(screen.getByText("Auto Detected Video")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Video Player" })).toBeInTheDocument();
  });

  it("renders MediaBar component", () => {
    render(
      <PlaylistProvider>
        <MediaBar
          src="https://example.com/song.mp3"
          title="Floating Bar Track"
          artist="Floating Artist"
          position="bottom"
        />
      </PlaylistProvider>
    );

    expect(screen.getByText("Floating Bar Track")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Media Bar" })).toBeInTheDocument();
  });

  it("renders MediaCenter in embedded mode", () => {
    render(
      <MediaCenter
        mode="embedded"
        title="Embedded Studio"
        playlist={[
          { id: "1", title: "Item 1", src: "https://example.com/item1.mp3", type: "audio" },
        ]}
      />
    );

    expect(screen.getByText("Embedded Studio")).toBeInTheDocument();
    expect(screen.getAllByText("Item 1").length).toBeGreaterThan(0);
  });
});
