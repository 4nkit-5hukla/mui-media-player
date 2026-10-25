import { createContext, useContext, ReactNode, FC } from "react";
import { PlaylistContextValue, PlaylistItem } from "../types/playlist";
import { usePlaylist, UsePlaylistOptions } from "../hooks/usePlaylist";

export const PlaylistContext = createContext<PlaylistContextValue | null>(null);

export interface PlaylistProviderProps extends UsePlaylistOptions {
  children: ReactNode;
  playlist?: PlaylistItem[];
}

export const PlaylistProvider: FC<PlaylistProviderProps> = ({
  children,
  playlist,
  initialItems,
  initialIndex,
  initialShuffle,
  initialRepeatMode,
}) => {
  const value = usePlaylist({
    initialItems: playlist || initialItems || [],
    initialIndex,
    initialShuffle,
    initialRepeatMode,
  });

  return (
    <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>
  );
};

export function usePlaylistContext(): PlaylistContextValue | null {
  return useContext(PlaylistContext);
}
