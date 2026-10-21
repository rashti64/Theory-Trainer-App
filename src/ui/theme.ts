/**
 * Design tokens. The look borrows from German road signage, not from any app:
 * Autobahn-sign blue for actions, priority-road yellow for rewards,
 * signal green/red for feedback, asphalt for text, and the Barlow typeface,
 * a free grotesk close in spirit to the DIN lettering on German signs.
 */
export const colors = {
  /** Autobahn sign blue: primary actions, current lesson. */
  blue: '#1C5DB0',
  blueDark: '#123F7A',
  blueTint: '#E3EDFA',
  /** Priority-road yellow: XP, streak, celebration. */
  yellow: '#FFC20E',
  yellowDark: '#C79200',
  yellowTint: '#FFF4CF',
  /** Signal green: correct answers. */
  green: '#239B48',
  greenDark: '#16702F',
  greenTint: '#E1F4E6',
  /** Signal red: wrong answers, 5-point questions. */
  red: '#D3262E',
  redDark: '#9C1A20',
  redTint: '#FBE4E5',
  /** Asphalt: text and neutral surfaces. */
  asphalt: '#2A3036',
  slate: '#5C6670',
  slateDark: '#3F474F',
  slateTint: '#E7EAED',
  line: '#D5DAE0',
  muted: '#7A848E',
  surface: '#FFFFFF',
  background: '#F3F5F7',
  white: '#FFFFFF',
} as const;

export type UnitColor = 'blue' | 'yellow' | 'green' | 'slate';

/** Fill, the darker "edge" used for the raised 3D look, and text colour on that fill. */
export const unitPalette: Record<UnitColor, { fill: string; edge: string; tint: string; ink: string }> = {
  blue: { fill: colors.blue, edge: colors.blueDark, tint: colors.blueTint, ink: colors.white },
  yellow: { fill: colors.yellow, edge: colors.yellowDark, tint: colors.yellowTint, ink: colors.asphalt },
  green: { fill: colors.green, edge: colors.greenDark, tint: colors.greenTint, ink: colors.white },
  slate: { fill: colors.slate, edge: colors.slateDark, tint: colors.slateTint, ink: colors.white },
};

export const fonts = {
  regular: 'Barlow_400Regular',
  medium: 'Barlow_500Medium',
  semibold: 'Barlow_600SemiBold',
  bold: 'Barlow_700Bold',
  black: 'Barlow_800ExtraBold',
} as const;

/** Type scale (size / line height). */
export const type = {
  display: { fontFamily: fonts.black, fontSize: 30, lineHeight: 34 },
  title: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28 },
  question: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 27 },
  body: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 24 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 24 },
  label: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20 },
  small: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { sm: 8, md: 14, lg: 20, round: 999 } as const;

/** Height of the darker bottom edge that gives buttons and nodes their pressable, raised look. */
export const EDGE = 4;
