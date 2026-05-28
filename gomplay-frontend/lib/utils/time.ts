/**
 * Parses a server-returned timestamp string.
 * The backend sends UTC times without a timezone suffix (no Z, no +09:00),
 * so JavaScript would otherwise treat them as local time — 9 hours behind KST.
 * Appending Z forces correct UTC → local conversion.
 */
export function parseServerTimestamp(ts: string): Date {
  if (!ts.endsWith("Z") && !/[+-]\d{2}:\d{2}$/.test(ts)) {
    return new Date(ts + "Z");
  }
  return new Date(ts);
}

export function formatChatListTime(timestamp?: string): string {
  if (!timestamp) return "";

  const date = parseServerTimestamp(timestamp);
  const now = new Date();
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function formatMessageTime(timestamp: string): string {
  return parseServerTimestamp(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDateTime(timestamp: string): string {
  return parseServerTimestamp(timestamp).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
