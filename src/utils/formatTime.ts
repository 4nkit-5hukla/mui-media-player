/**
 * Formats time in seconds into a human-readable string:
 * - If under 1 hour: "m:ss" (e.g. "3:45")
 * - If 1 hour or more: "h:mm:ss" (e.g. "1:15:20")
 */
export function formatTime(timeInSeconds?: number | null): string {
  if (timeInSeconds === undefined || timeInSeconds === null || isNaN(timeInSeconds) || timeInSeconds < 0) {
    return "0:00";
  }

  const totalSecs = Math.floor(timeInSeconds);
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  const paddedSeconds = seconds.toString().padStart(2, "0");

  if (hours > 0) {
    const paddedMinutes = minutes.toString().padStart(2, "0");
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${minutes}:${paddedSeconds}`;
}
