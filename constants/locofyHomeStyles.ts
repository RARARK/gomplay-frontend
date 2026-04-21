const fontFamilies = {
  inter: "Inter",
  sfPro: "SF Pro",
} as const;

const fontSizes = {
  xs: 10,
  sm: 11,
  md: 13,
  lg: 15,
  xl: 17,
  title: 22,
} as const;

const colors = {
  accent100: "#e24cb5",
  black: "#000",
  ghostWhite: "#f4f3fa",
  grayOverlay: "rgba(0, 0, 0, 0.15)",
  khaki: "#fdd46a",
  lightSteelBlue: "#c1cdff",
  royalBlue: "#5567d3",
  orangered: "#ff6600",
  silver: "#bbb7c7",
  slateGray: "#706f88",
  white: "#fff",
  labelPrimary: "#000",
  neutral100: "#f2f2f2",
  neutral300: "#bbb7c7",
  neutral500: "#5c5a63",
  neutral700: "#413f46",
  neutral900: "#070322",
  primary100: "#4c5be2",
  primary900: "#2a327d",
  secondary100: "#e2d34c",
} as const;

const spacing = {
  0: 0,
  1: 1,
  3: 3,
  4: 4,
  5: 5,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
  13: 13,
  14: 14,
  16: 16,
  17: 17,
  18: 18,
  19: 19,
  20: 20,
  21: 21,
  24: 24,
  29: 29,
  32: 32,
  39: 39,
  48: 48,
  57: 57,
  69: 69,
  71: 71,
  80: 80,
  273: 273,
} as const;

const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  pill: 33,
  round: 100,
} as const;

const shadows = {
  drop: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  glow: "0px 0px 20px rgba(255, 255, 255, 0.3)",
} as const;

const sizes = {
  10: 10,
  12: 12,
  13: 13,
  14_6: 15,
  18: 18,
  19: 19,
  20: 20,
  21: 21,
  22: 22,
  24: 24,
  24_67: 25,
  27: 27,
  30_7: 31,
  31: 31,
  32: 32,
  37: 37,
  38: 38,
  40: 40,
  44: 44,
  48: 48,
  56: 56,
  64: 64,
  70: 70,
  88_6: 89,
  91_6: 92,
  92: 92,
  121: 121,
  131: 131,
  133: 133,
  142: 142,
  144: 144,
  180: 180,
  303: 303,
  316: 316,
  374: 374,
  402: 402,
  416: 416,
} as const;

const lineHeights = {
  xs: 13,
  sm: 18,
  md: 20,
  lg: 22,
  xl: 28,
} as const;

const letterSpacings = {
  tightXs: 0,
  tightSm: 0,
  tightMd: 0,
  normalSm: 0,
  normalMd: 0,
} as const;

export const tokens = {
  fontFamilies,
  fontSizes,
  colors,
  spacing,
  radius,
  shadows,
  sizes,
  lineHeights,
  letterSpacings,
} as const;

/* Fonts */
export const FontFamily = {
  inter: fontFamilies.inter,
  sFPro: fontFamilies.sfPro,
} as const;

/* Font sizes */
export const FontSize = {
  fs_10: fontSizes.xs,
  fs_11: fontSizes.sm,
  fs_13: fontSizes.md,
  fs_15: fontSizes.lg,
  fs_17: fontSizes.xl,
  fs_22: fontSizes.title,
} as const;

/* Colors */
export const Color = {
  accent100: colors.accent100,
  colorBlack: colors.black,
  colorGhostwhite: colors.ghostWhite,
  colorGray: colors.grayOverlay,
  colorKhaki: colors.khaki,
  colorLightsteelblue: colors.lightSteelBlue,
  colorRoyalblue: colors.royalBlue,
  colorOrangered: colors.orangered,
  colorSilver: colors.silver,
  colorSlategray: colors.slateGray,
  colorWhite: colors.white,
  labelsPrimary: colors.labelPrimary,
  neutral100: colors.neutral100,
  neutral300: colors.neutral300,
  neutral500: colors.neutral500,
  neutral700: colors.neutral700,
  neutral900: colors.neutral900,
  nuetral100: colors.neutral100,
  nuetral300: colors.neutral300,
  nuetral500: colors.neutral500,
  nuetral700: colors.neutral700,
  nuetral900: colors.neutral900,
  primary100: colors.primary100,
  primary900: colors.primary900,
  secondary100: colors.secondary100,
} as const;

/* Gaps */
export const Gap = {
  gap_4: spacing[4],
  gap_7: spacing[7],
  gap_8: spacing[8],
  gap_11: spacing[11],
  gap_12: spacing[12],
  gap_14: spacing[14],
  gap_16: spacing[16],
  gap_17: spacing[17],
  gap_20: spacing[20],
  gap_24: spacing[24],
  gap_48: spacing[48],
  gap_69: spacing[69],
  gap_71: spacing[71],
} as const;

/* Paddings */
export const Padding = {
  padding_0: spacing[0],
  padding_1: spacing[1],
  padding_3: spacing[3],
  padding_5: spacing[5],
  padding_5_2: spacing[5],
  padding_6_9: spacing[7],
  padding_7: spacing[7],
  padding_8: spacing[8],
  padding_9: spacing[9],
  padding_10: spacing[10],
  padding_10_3: spacing[10],
  padding_11: spacing[11],
  padding_13: spacing[13],
  padding_14: spacing[14],
  padding_18: spacing[18],
  padding_19: spacing[19],
  padding_20: spacing[20],
  padding_21: spacing[21],
  padding_24: spacing[24],
  padding_29: spacing[29],
  padding_32: spacing[32],
  padding_39: spacing[39],
  padding_57: spacing[57],
  padding_80: spacing[80],
  padding_273: spacing[273],
} as const;

/* Border radiuses */
export const Border = {
  br_4: radius.sm,
  br_8: radius.md,
  br_16: radius.lg,
  br_32_7: radius.pill,
  br_100: radius.round,
} as const;

/* Box shadows */
export const BoxShadow = {
  shadow_drop: shadows.drop,
  shadow_drop1: shadows.glow,
} as const;

/* Width */
export const Width = {
  width_10: sizes[10],
  width_18: sizes[18],
  width_19: sizes[19],
  width_21: sizes[21],
  width_22: sizes[22],
  width_24: sizes[24],
  width_24_67: sizes[24_67],
  width_31: sizes[31],
  width_32: sizes[32],
  width_37: sizes[37],
  width_40: sizes[40],
  width_44: sizes[44],
  width_48: sizes[48],
  width_56: sizes[56],
  width_70: sizes[70],
  width_88_6: sizes[88_6],
  width_91_6: sizes[91_6],
  width_92: sizes[92],
  width_121: sizes[121],
  width_131: sizes[131],
  width_142: sizes[142],
  width_144: sizes[144],
  width_303: sizes[303],
  width_316: sizes[316],
  width_374: sizes[374],
  width_402: sizes[402],
} as const;

/* Height */
export const Height = {
  height_12: sizes[12],
  height_13: sizes[13],
  height_14_6: sizes[14_6],
  height_18: sizes[18],
  height_20: sizes[20],
  height_22: sizes[22],
  height_24: sizes[24],
  height_24_67: sizes[24_67],
  height_27: sizes[27],
  height_30_7: sizes[30_7],
  height_32: sizes[32],
  height_38: sizes[38],
  height_48: sizes[48],
  height_64: sizes[64],
  height_133: sizes[133],
  height_180: sizes[180],
  height_416: sizes[416],
} as const;

/* Line-height */
export const LineHeight = {
  lh_13: lineHeights.xs,
  lh_18: lineHeights.sm,
  lh_20: lineHeights.md,
  lh_22: lineHeights.lg,
  lh_28: lineHeights.xl,
} as const;

/* Letter-spacing */
export const LetterSpacing = {
  ls__0_08: letterSpacings.tightXs,
  ls__0_41: letterSpacings.tightSm,
  ls__0_5: letterSpacings.tightMd,
  ls_0_06: letterSpacings.normalSm,
  ls_0_07: letterSpacings.normalMd,
} as const;

export const HomeLayout = {
  statusIllustrationSize: sizes[144],
  statusContentMinHeight: sizes[180],
  matchedContentMinHeight: sizes[416] + spacing[24] + spacing[80],
  recommendationCardWidth: sizes[142],
  recommendationCardHeight: 280,
  recommendationCardImageHeight: sizes[133],
  groupCardImageHeight: sizes[133],
  partnerCardWidth: sizes[303],
  partnerCardMinHeight: sizes[416],
  partnerCardVisualHeight: 208,
  partnerProfileSize: 167,
  actionButtonHeight: sizes[44],
  navButtonSize: sizes[48],
} as const;
