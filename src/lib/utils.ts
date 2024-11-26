export function formatSeconds(s: number): string {
  s = Math.floor(s);
  const hours = Math.floor((s / 60) / 60);
  return `${hours > 0 ? `${hours.toString().padStart(2, "0")}:` : ""}${Math.floor((s / 60) % 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}
