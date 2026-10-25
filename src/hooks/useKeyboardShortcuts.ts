import { KeyboardEvent, useCallback } from "react";

export interface KeyboardShortcutHandlers {
  onTogglePlay?: () => void;
  onToggleFullscreen?: () => void;
  onToggleMute?: () => void;
  onTogglePiP?: () => void;
  onSkip?: (delta: number) => void;
  onRestart?: () => void;
  onVolumeChange?: (delta: number) => void;
  disabled?: boolean;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  const {
    onTogglePlay,
    onToggleFullscreen,
    onToggleMute,
    onTogglePiP,
    onSkip,
    onRestart,
    onVolumeChange,
    disabled = false,
  } = handlers;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (disabled) return;

      // Do not trigger if typing in form controls
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Play / Pause (Space or 'k')
      if (e.key === " " || key === "k") {
        e.preventDefault();
        onTogglePlay?.();
      }
      // Fullscreen ('f')
      else if (key === "f") {
        e.preventDefault();
        onToggleFullscreen?.();
      }
      // Mute / Unmute ('m')
      else if (key === "m") {
        e.preventDefault();
        onToggleMute?.();
      }
      // Picture-in-Picture ('p')
      else if (key === "p") {
        e.preventDefault();
        onTogglePiP?.();
      }
      // Rewind 5s (Left Arrow) or 10s ('j')
      else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onSkip?.(-5);
      } else if (key === "j") {
        e.preventDefault();
        onSkip?.(-10);
      }
      // Forward 5s (Right Arrow) or 10s ('l')
      else if (e.key === "ArrowRight") {
        e.preventDefault();
        onSkip?.(5);
      } else if (key === "l") {
        e.preventDefault();
        onSkip?.(10);
      }
      // Volume Up (Up Arrow)
      else if (e.key === "ArrowUp") {
        e.preventDefault();
        onVolumeChange?.(0.1);
      }
      // Volume Down (Down Arrow)
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        onVolumeChange?.(-0.1);
      }
      // Restart (Home or '0')
      else if (e.key === "0" || e.key === "Home") {
        e.preventDefault();
        onRestart?.();
      }
    },
    [
      disabled,
      onTogglePlay,
      onToggleFullscreen,
      onToggleMute,
      onTogglePiP,
      onSkip,
      onRestart,
      onVolumeChange,
    ]
  );

  return { handleKeyDown };
}
