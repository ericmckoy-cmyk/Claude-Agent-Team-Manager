import { describe, expect, it } from "vitest";
import { parseCronForOs } from "@/services/cron";

// These tests pin today's behavior before Phase 1 changes it.
// Cases marked "known gap" show where the OS schedule loses detail.
describe("parseCronForOs", () => {
  it("daily at a fixed time", () => {
    expect(parseCronForOs("30 7 * * *")).toEqual({ startTime: "07:30", repeat: "daily" });
  });

  it("hourly when the hour is *", () => {
    expect(parseCronForOs("15 * * * *")).toEqual({ startTime: "00:15", repeat: "hourly" });
  });

  it("weekly when a weekday is set", () => {
    expect(parseCronForOs("0 7 * * 1")).toEqual({ startTime: "07:00", repeat: "weekly" });
  });

  it("monthly when a day of month is set", () => {
    expect(parseCronForOs("0 9 1 * *")).toEqual({ startTime: "09:00", repeat: "monthly" });
  });

  it("falls back to once for a short expression", () => {
    expect(parseCronForOs("0 9")).toEqual({ startTime: "09:00", repeat: "once" });
  });

  it("known gap: the weekday itself is dropped (Mon and Fri look the same)", () => {
    expect(parseCronForOs("0 7 * * 1")).toEqual(parseCronForOs("0 7 * * 5"));
  });

  it("known gap: weekdays 1-5 becomes plain weekly", () => {
    expect(parseCronForOs("0 7 * * 1-5").repeat).toBe("weekly");
  });

  it("known gap: every 6 hours becomes daily at 06:00", () => {
    expect(parseCronForOs("0 */6 * * *")).toEqual({ startTime: "06:00", repeat: "daily" });
  });
});
