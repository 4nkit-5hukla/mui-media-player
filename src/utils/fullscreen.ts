interface VendorDocument extends Document {
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface VendorElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

export function isFullscreen(): boolean {
  if (typeof document === "undefined") return false;
  const doc = document as VendorDocument;
  return Boolean(
    doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
  );
}

export async function requestFullscreen(element: HTMLElement | null): Promise<void> {
  if (!element) return;
  const el = element as VendorElement;

  try {
    if (el.requestFullscreen) {
      await el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      await el.webkitRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      await el.mozRequestFullScreen();
    } else if (el.msRequestFullscreen) {
      await el.msRequestFullscreen();
    }
  } catch (err) {
    // fullscreen request may be denied or blocked
  }
}

export async function exitFullscreen(): Promise<void> {
  if (typeof document === "undefined") return;
  const doc = document as VendorDocument;

  try {
    if (doc.exitFullscreen) {
      await doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      await doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      await doc.msExitFullscreen();
    }
  } catch (err) {
    // fullscreen exit failed
  }
}

export async function toggleFullscreen(element: HTMLElement | null): Promise<void> {
  if (isFullscreen()) {
    await exitFullscreen();
  } else if (element) {
    await requestFullscreen(element);
  }
}

export function addFullscreenChangeListener(callback: () => void): () => void {
  if (typeof document === "undefined") return () => {};

  const events = [
    "fullscreenchange",
    "webkitfullscreenchange",
    "mozfullscreenchange",
    "MSFullscreenChange",
  ];

  events.forEach((evt) => document.addEventListener(evt, callback));

  return () => {
    events.forEach((evt) => document.removeEventListener(evt, callback));
  };
}
