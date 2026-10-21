/**
 * Design tokens. The look borrows from German road signage, not from any app:
 * Autobahn-sign blue for actions, priority-road yellow for rewards,
 * signal green/red for feedback, asphalt grey for text. Saturated colours,
 * each with a darker edge shade for the raised, tactile look.
 */
export const colors = {
  /** Autobahn blue: primary actions, current lesson. */
  blue: '#2B70E4',
  blueDark: '#1A4FB0',
  blueTint: '#E2EDFF',
  /** Priority-road yellow: XP, rewards, finished lessons. */
  yellow: '#FFC400',
  yellowDark: '#D99A00',
  yellowTint: '#FFF4CC',
  /** Signal green: correct answers. */
  green: '#2FBF5B',
  greenDark: '#1F9445',
  greenTint: '#DFF7E6',
  /** Signal red: wrong answers, 5-point questions. */
  red: '#F5484A',
  redDark: '#C9302F',
  redTint: '#FFE4E4',
  /** Streak orange. */
  orange: '#FF8A00',
  orangeDark: '#C96400',
  /** Asphalt: text (never pure black) and neutral surfaces. */
  asphalt: '#3C4650',
  slate: '#6B7785',
  slateDark: '#4A5560',
  slateTint: '#EDF0F3',
  line: '#E2E6EA',
  muted: '#8A95A1',
  surface: '#FFFFFF',
  background: '#FFFFFF',
  white: '#FFFFFF',
} as const;

export type UnitColor = 'blue' | 'yellow' | 'green' | 'slate';

/** Fill, the darker "edge" used for the raised 3D look, and text colour on that fill. */
export const unitPalette: Record<UnitColor, { fill: string; edge: string; tint: string; ink: string }> = {
  blue: { fill: colors.blue, edge: colors.blueDark, tint: colors.blueTint, ink: colors.white },
  yellow: { fill: colors.orange, edge: colors.orangeDark, tint: colors.yellowTint, ink: colors.white },
  green: { fill: colors.green, edge: colors.greenDark, tint: colors.greenTint, ink: colors.white },
  slate: { fill: '#8B5CF6', edge: '#6A3FD1', tint: '#EFE8FF', ink: colors.white },
};

/** Nunito: a free, rounded typeface for the friendly, chunky look. */
export const fonts = {
  regular: 'Nunito_600SemiBold',
  medium: 'Nunito_700Bold',
  semibold: 'Nunito_700Bold',
  bold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
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

export const radius = { sm: 10, md: 16, lg: 22, round: 999 } as const;

/** Height of the darker bottom edge that gives buttons and nodes their pressable, raised look. */
export const EDGE = 5;
