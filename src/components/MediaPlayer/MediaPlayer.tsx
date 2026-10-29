import { FC } from "react";
import { usePlaylistContext } from "../../context/PlaylistContext";
import { detectMediaType } from "../../utils/mediaDetection";
import { VideoPlayer } from "../VideoPlayer";
import { AudioPlayer } from "../AudioPlayer";
import { MediaPlayerProps } from "./types";

export const MediaPlayer: FC<MediaPlayerProps> = (props) => {
  const {
    src: directSrc,
    type: explicitType,
    title: directTitle,
    subtitle,
    artist: directArtist,
    album: directAlbum,
    poster: directPoster,
    artwork: directArtwork,
    subtitles: directSubtitles,
    audioTracks: directAudioTracks,
    lyrics: directLyrics,
    aspectRatio,
    audioVariant,
    showWaveform = true,
    visualizer = "wavesurfer",
    seekbarMode = "slider",
    playlist: directPlaylist,
    ...restProps
  } = props;

  const playlistCtx = usePlaylistContext();
  const currentItem = playlistCtx?.currentItem;

  // Resolve source: prioritize current playlist item if active, else direct prop
  const activeSrc = currentItem?.src || directSrc;
  const activeType = currentItem?.type || explicitType;
  const activeTitle = currentItem?.title || directTitle;
  const activeArtist = currentItem?.artist || directArtist;
  const activeAlbum = currentItem?.album || directAlbum;
  const activePoster = currentItem?.poster || directPoster;
  const activeArtwork = currentItem?.artwork || directArtwork || activePoster;
  const activeSubtitles = currentItem?.subtitles || directSubtitles;
  const activeAudioTracks = currentItem?.audioTracks || directAudioTracks;
  const activeLyrics = currentItem?.lyrics || directLyrics;

  // Detect whether media is audio or video
  const resolvedType = detectMediaType(activeSrc, activeType);

  if (resolvedType === "audio") {
    return (
      <AudioPlayer
        src={activeSrc}
        title={activeTitle}
        artist={activeArtist}
        album={activeAlbum}
        artwork={activeArtwork}
        lyrics={activeLyrics}
        variant={audioVariant}
        showWaveform={showWaveform}
        visualizer={visualizer}
        seekbarMode={seekbarMode}
        playlist={directPlaylist}
        {...restProps}
      />
    );
  }

  // Default to VideoPlayer for 'video' or 'youtube'
  return (
    <VideoPlayer
      src={activeSrc}
      title={activeTitle}
      subtitle={subtitle || activeArtist}
      poster={activePoster}
      subtitles={activeSubtitles}
      audioTracks={activeAudioTracks}
      aspectRatio={aspectRatio}
      playlist={directPlaylist}
      {...restProps}
    />
  );
};
