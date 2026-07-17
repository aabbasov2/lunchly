export interface CutoffInfo {
  closed: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export function getCutoffInfo(now: Date = new Date()): CutoffInfo {
  const cutoff = new Date(now);
  cutoff.setHours(18, 0, 0, 0);
  const diff = cutoff.getTime() - now.getTime();
  if (diff <= 0) {
    return { closed: true, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }
  const totalSeconds = Math.floor(diff / 1000);
  return {
    closed: false,
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalMs: diff,
  };
}
