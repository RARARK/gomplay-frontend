// sockjs-client checks for window in some internal code paths.
// React Native does not have window, so we alias it to global.
if (typeof (global as Record<string, unknown>).window === "undefined") {
  (global as Record<string, unknown>).window = global;
}
