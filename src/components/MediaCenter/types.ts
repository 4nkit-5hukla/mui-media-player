import { ReactNode } from "react";
import { MediaCenterMode, BasePlayerProps } from "../../types/player";
import { PlaylistItem } from "../../types/playlist";

export interface MediaCenterProps extends BasePlayerProps {
  /** Mode: 'modal' (Dialog popup) or 'embedded' (in-page workstation). Default 'modal'. */
  mode?: MediaCenterMode;
  /** Whether the modal is open (applicable when mode='modal') */
  open?: boolean;
  /** Close callback */
  onClose?: () => void;
  /** Center header title (default 'Media Center') */
  title?: string;
  /** Initial playlist items */
  playlist?: PlaylistItem[];
  /** Default active playlist item index */
  initialIndex?: number;
  /** Extra header actions */
  headerActions?: ReactNode;
}
