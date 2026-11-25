import type { ImageSourcePropType } from "react-native";

/**
 * Image source usable by both React Native's Image/ImageBackground and expo-image.
 * React Native 0.88 added a readonly array form to ImageSourcePropType that expo-image
 * does not accept, so the array form is excluded here. The app never passes arrays.
 */
export type AppImageSource = Exclude<ImageSourcePropType, readonly unknown[]>;
