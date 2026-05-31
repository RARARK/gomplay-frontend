/**
 * Parses a server-returned timestamp string.
 *
 * - Strings with explicit offset (e.g. +09:00) or Z are parsed as-is.
 * - Strings without any offset/Z suffix are treated as KST (UTC+09:00).
 */
export function parseServerTimestamp(ts: string): Date {
  if (!ts.endsWith("Z") && !/[+-]\d{2}:\d{2}$/.test(ts)) {
    return new Date(ts + "+09:00");
  }
  return new Date(ts);
}

/**
 * Parses a server timestamp and returns a Date whose *local* accessors
 * (getHours, getDate, etc.) return KST (Asia/Seoul, UTC+9) values.
 *
 * Use this whenever you need to call getHours()/getDate()/getDay() on a
 * server timestamp so that the result is correct even on non-KST devices.
 */
export function parseToKST(ts: string): Date {
  const date = parseServerTimestamp(ts);
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
  // getTimezoneOffset() is (UTC - local) in minutes, negative for east-of-UTC zones
  const localOffsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() + KST_OFFSET_MS + localOffsetMs);
}

export function formatChatListTime(timestamp?: string): string {
  if (!timestamp) return "";

  const date = parseServerTimestamp(timestamp);
  const now = new Date();

  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    date.toLocaleString("ko-KR", { timeZone: "Asia/Seoul", ...opts });

  const todayStr = now.toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" });
  const dateStr  = date.toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" });

  if (todayStr === dateStr) {
    return fmt({ hour: "numeric", minute: "2-digit" });
  }
  return fmt({ month: "short", day: "numeric" });
}

export function formatMessageTime(timestamp: string): string {
  return parseServerTimestamp(timestamp).toLocaleTimeString("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDateTime(timestamp: string): string {
  return parseServerTimestamp(timestamp).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
