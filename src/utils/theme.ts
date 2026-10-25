import { Theme, Palette } from "@mui/material/styles";

/**
 * Safely resolves a color from the MUI theme palette (e.g. 'primary', 'secondary', 'error')
 * or returns custom string color or fallback to primary.main.
 */
export function resolveAccentColor(theme: Theme, accentColor?: string): string {
  if (!accentColor) {
    return theme.palette.primary.main;
  }

  if (accentColor in theme.palette) {
    const paletteEntry = theme.palette[accentColor as keyof Palette];
    if (
      typeof paletteEntry === "object" &&
      paletteEntry !== null &&
      "main" in paletteEntry &&
      typeof paletteEntry.main === "string"
    ) {
      return paletteEntry.main;
    }
  }

  return accentColor;
}
