/**
 * Cron helpers for the OS scheduler. Kept free of Tauri imports so they can be unit-tested.
 */

/** Parse a cron expression into start_time (HH:MM) and repeat type for schtasks. */
export function parseCronForOs(cron: string): { startTime: string; repeat: string } {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) return { startTime: "09:00", repeat: "once" };

  const [min, hour, dayOfMonth, , dayOfWeek] = parts;

  // Determine repeat type
  let repeat = "daily";
  if (hour === "*") {
    repeat = "hourly";
  } else if (dayOfWeek !== "*" && dayOfWeek !== "?") {
    repeat = "weekly";
  } else if (dayOfMonth !== "*" && dayOfMonth !== "?") {
    repeat = "monthly";
  }

  // Build HH:MM
  const h = hour === "*" ? "0" : hour.replace(/\*\//, "");
  const m = min === "*" ? "0" : min.replace(/\*\//, "");
  const startTime = `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;

  return { startTime, repeat };
}
