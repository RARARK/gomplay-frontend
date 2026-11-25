// sockjs-client checks for window in some internal code paths.
// React Native does not have window, so we alias it to globalThis.
if (typeof (globalThis as Record<string, unknown>).window === "undefined") {
  (globalThis as Record<string, unknown>).window = globalThis;
}
