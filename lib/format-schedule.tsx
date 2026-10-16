import type { ReactNode } from "react";

/**
 * Keep time ranges like 10:00–19:00 on one line (no break at the dash).
 */
export function formatScheduleText(schedule: string): ReactNode {
  const parts = schedule.split(/(\d{1,2}:\d{2}\s*[–—-]\s*\d{1,2}:\d{2})/);

  if (parts.length === 1) {
    return schedule;
  }

  return parts.map((part, index) => {
    if (/^\d{1,2}:\d{2}\s*[–—-]\s*\d{1,2}:\d{2}$/.test(part)) {
      const compact = part.replace(/\s*([–—-])\s*/, "$1");
      return (
        <span key={index} className="schedule-time">
          {compact}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
