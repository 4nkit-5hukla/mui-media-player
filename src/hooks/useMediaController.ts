import {
  useRef,
  useState,
  useEffect,
  useCallback,
  SyntheticEvent,
} from "react";
import {
  BasePlayerProps,
  MediaControllerState,
  MediaErrorState,
} from "../types/player";
import {
  isFullscreen as checkIsFullscreen,
  toggleFullscreen as execToggleFullscreen,
  addFullscreenChangeListener,
} from "../utils/fullscreen";

export interface UseMediaControllerOptions extends BasePlayerProps {
  /** Controls hide timeout in ms (default 2500) */
  hideControlsTimeout?: number;
}

export function useMediaController(options: UseMediaControllerOptions = {}) {
  const {
    autoPlay = false,
    defaultVolume = 1,
    defaultPlaybackRate = 1,
    muted: initialMuted = false,
    hideControlsTimeout = 2500,
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
    onDurationChange,
    onVolumeChange,
    onPlaybackRateChange,
    onError,
  } = options;

  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<MediaControllerState>({
    isPlaying: false,
    isBuffering: false,
    currentTime: 0,
    duration: 0,
    volume: defaultVolume,
    isMuted: initialMuted,
    playbackRate: defaultPlaybackRate,
    isFullscreen: false,
    isPiP: false,
    isSeeking: false,
    bufferedEnd: 0,
    error: null,
  });

  const [isControlsVisible, setIsControlsVisible] = useState(true);

  // Auto-hiding controls timer
  const showControls = useCallback(() => {
    setIsControlsVisible(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    if (state.isPlaying) {
      hideTimerRef.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, hideControlsTimeout);
    }
  }, [state.isPlaying, hideControlsTimeout]);

  // Keep controls visible when paused or buffering
  useEffect(() => {
    if (!state.isPlaying || state.isBuffering) {
      setIsControlsVisible(true);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    } else {
      showControls();
    }

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [state.isPlaying, state.isBuffering, showControls]);

  // Sync fullscreen change listener
  useEffect(() => {
    const cleanup = addFullscreenChangeListener(() => {
      setState((prev) => ({ ...prev, isFullscreen: checkIsFullscreen() }));
    });
    return cleanup;
  }, []);

  // Sync PiP change listener on video element
  useEffect(() => {
    const media = mediaRef.current;
    if (!media || !(media instanceof HTMLVideoElement)) return;

    const handleEnterPiP = () => setState((prev) => ({ ...prev, isPiP: true }));
    const handleLeavePiP = () => setState((prev) => ({ ...prev, isPiP: false }));

    media.addEventListener("enterpictureinpicture", handleEnterPiP);
    media.addEventListener("leavepictureinpicture", handleLeavePiP);

    return () => {
      media.removeEventListener("enterpictureinpicture", handleEnterPiP);
      media.removeEventListener("leavepictureinpicture", handleLeavePiP);
    };
  }, []);

  // Update buffer range
  const updateBuffered = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    const { buffered, currentTime } = media;
    if (buffered && buffered.length > 0) {
      for (let i = buffered.length - 1; i >= 0; i--) {
        if (buffered.start(i) <= currentTime) {
          setState((prev) => ({ ...prev, bufferedEnd: buffered.end(i) }));
          break;
        }
      }
    }
  }, []);

  // Controls actions
  const play = useCallback(async () => {
    const media = mediaRef.current;
    if (!media) return;
    try {
      await media.play();
    } catch (err) {
      // Browsers may block autoplay or play on user gesture
    }
  }, []);

  const pause = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    media.pause();
  }, []);

  const togglePlay = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    if (state.isPlaying || (!media.paused && !media.ended)) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, pause, play]);

  const seek = useCallback(
    (timeInSeconds: number) => {
      const media = mediaRef.current;
      if (!media) return;
      const targetTime = Math.max(0, Math.min(media.duration || 0, timeInSeconds));
      media.currentTime = targetTime;
      setState((prev) => ({ ...prev, currentTime: targetTime }));
      showControls();
    },
    [showControls]
  );

  const skip = useCallback(
    (deltaInSeconds: number) => {
      const media = mediaRef.current;
      if (!media) return;
      const targetTime = Math.max(0, Math.min(media.duration || 0, media.currentTime + deltaInSeconds));
      media.currentTime = targetTime;
      setState((prev) => ({ ...prev, currentTime: targetTime }));
      showControls();
    },
    [showControls]
  );

  const restart = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    media.currentTime = 0;
    setState((prev) => ({ ...prev, currentTime: 0 }));
    play();
    showControls();
  }, [play, showControls]);

  const handleSeekChange = useCallback(
    (_: Event | SyntheticEvent, value: number | number[]) => {
      const newTime = Array.isArray(value) ? value[0] : value;
      setState((prev) => ({ ...prev, currentTime: newTime, isSeeking: true }));
      showControls();
    },
    [showControls]
  );

  const handleSeekCommitted = useCallback(
    (_: Event | SyntheticEvent, value: number | number[]) => {
      const newTime = Array.isArray(value) ? value[0] : value;
      const media = mediaRef.current;
      if (media) {
        media.currentTime = newTime;
      }
      setState((prev) => ({ ...prev, currentTime: newTime, isSeeking: false }));
      showControls();
    },
    [showControls]
  );

  const setVolume = useCallback(
    (newVolume: number) => {
      const media = mediaRef.current;
      const clamped = Math.max(0, Math.min(1, newVolume));
      if (media) {
        media.volume = clamped;
        media.muted = clamped === 0;
      }
      setState((prev) => ({ ...prev, volume: clamped, isMuted: clamped === 0 }));
      onVolumeChange?.(clamped, clamped === 0);
      showControls();
    },
    [onVolumeChange, showControls]
  );

  const toggleMute = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    const nextMuted = !state.isMuted;
    media.muted = nextMuted;
    setState((prev) => ({ ...prev, isMuted: nextMuted }));
    onVolumeChange?.(state.volume, nextMuted);
    showControls();
  }, [state.isMuted, state.volume, onVolumeChange, showControls]);

  const handleVolumeChange = useCallback(
    (_: Event | SyntheticEvent, value: number | number[]) => {
      const val = Array.isArray(value) ? value[0] : value;
      setVolume(val / 100);
    },
    [setVolume]
  );

  const setPlaybackRate = useCallback(
    (rate: number) => {
      const media = mediaRef.current;
      if (media) {
        media.playbackRate = rate;
      }
      setState((prev) => ({ ...prev, playbackRate: rate }));
      onPlaybackRateChange?.(rate);
      showControls();
    },
    [onPlaybackRateChange, showControls]
  );

  const toggleFullscreen = useCallback(async () => {
    await execToggleFullscreen(containerRef.current);
    showControls();
  }, [showControls]);

  const togglePiP = useCallback(async () => {
    const media = mediaRef.current;
    if (!media || !(media instanceof HTMLVideoElement)) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setState((prev) => ({ ...prev, isPiP: false }));
      } else if (document.pictureInPictureEnabled && media.requestPictureInPicture) {
        await media.requestPictureInPicture();
        setState((prev) => ({ ...prev, isPiP: true }));
      }
    } catch {
      // PiP not supported or rejected
    }
  }, []);

  // Event handlers to spread on HTML video or audio element
  const mediaEventHandlers = {
    onPlay: () => {
      setState((prev) => ({ ...prev, isPlaying: true, error: null }));
      onPlay?.();
    },
    onPause: () => {
      setState((prev) => ({ ...prev, isPlaying: false }));
      onPause?.();
    },
    onEnded: () => {
      setState((prev) => ({ ...prev, isPlaying: false }));
      onEnded?.();
    },
    onWaiting: () => {
      setState((prev) => ({ ...prev, isBuffering: true }));
    },
    onPlaying: () => {
      setState((prev) => ({ ...prev, isBuffering: false, isPlaying: true }));
    },
    onCanPlay: () => {
      setState((prev) => ({ ...prev, isBuffering: false }));
    },
    onProgress: () => {
      updateBuffered();
    },
    onDurationChange: (e: SyntheticEvent<HTMLMediaElement>) => {
      const dur = e.currentTarget.duration || 0;
      setState((prev) => ({ ...prev, duration: dur }));
      onDurationChange?.(dur);
    },
    onLoadedMetadata: (e: SyntheticEvent<HTMLMediaElement>) => {
      const media = e.currentTarget;
      const dur = media.duration || 0;
      media.volume = state.volume;
      media.muted = state.isMuted;
      media.playbackRate = state.playbackRate;
      setState((prev) => ({ ...prev, duration: dur, error: null }));
      if (autoPlay) {
        media.play().catch(() => undefined);
      }
    },
    onTimeUpdate: (e: SyntheticEvent<HTMLMediaElement>) => {
      if (!state.isSeeking) {
        const time = e.currentTarget.currentTime || 0;
        setState((prev) => ({ ...prev, currentTime: time }));
        onTimeUpdate?.(time);
      }
      updateBuffered();
    },
    onVolumeChange: (e: SyntheticEvent<HTMLMediaElement>) => {
      const target = e.currentTarget;
      setState((prev) => ({
        ...prev,
        volume: target.volume,
        isMuted: target.muted,
      }));
    },
    onError: (e: SyntheticEvent<HTMLMediaElement>) => {
      const target = e.currentTarget;
      const err = target.error;
      const errorObj: MediaErrorState = {
        code: err?.code,
        message: err?.message || "An error occurred during media playback.",
      };
      setState((prev) => ({
        ...prev,
        isBuffering: false,
        isPlaying: false,
        error: errorObj,
      }));
      onError?.(errorObj, e);
    },
  };

  return {
    mediaRef,
    containerRef,
    state,
    isControlsVisible,
    showControls,
    play,
    pause,
    togglePlay,
    seek,
    skip,
    restart,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleFullscreen,
    togglePiP,
    handleSeekChange,
    handleSeekCommitted,
    handleVolumeChange,
    mediaEventHandlers,
  };
}
