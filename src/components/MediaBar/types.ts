import { ReactNode } from "react";
import { MediaBarPosition, BasePlayerProps } from "../../types/player";
import { PlaylistItem } from "../../types/playlist";

export interface MediaBarProps extends BasePlayerProps {
  /** Docked position: 'bottom' | 'top' | 'floating' (default 'bottom') */
  position?: MediaBarPosition;
  /** Whether the bar can be closed / dismissed */
  onClose?: () => void;
  /** Callback when user clicks expand / open MediaCenter button */
  onExpand?: () => void;
  /** Optional custom title override */
  title?: string;
  /** Optional custom artist override */
  artist?: string;
  /** Optional custom artwork override */
  artwork?: string;
  /** Optional playlist items */
  playlist?: PlaylistItem[];
  /** Extra controls to render on the right */
  extraControls?: ReactNode;
}
