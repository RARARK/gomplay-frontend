import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Bottom padding a bottom sheet inside a React Native <Modal> needs to clear the device's
 * bottom system UI.
 *
 * - iOS: the modal covers the whole screen, so the sheet must clear the home indicator.
 * - Android: the modal window ends above the navigation bar (it is not drawn behind it),
 *   so adding the inset would only leave an empty gap under the sheet.
 *
 * Regular screens are different: on Android (edge-to-edge) they are drawn behind the
 * navigation bar, so they should keep using `insets.bottom` directly.
 */
export function useModalBottomInset(): number {
  const insets = useSafeAreaInsets();
  return Platform.OS === "ios" ? insets.bottom : 0;
}
