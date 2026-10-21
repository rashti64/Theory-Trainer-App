/** Answer letters drawn as little road signs: circle, triangle, square, octagon, diamond. */
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { AppText } from './components';
import { fonts } from './theme';

const SHAPES = [
  { ink: '#FFFFFF', draw: <Circle cx={18} cy={18} r={16} fill="#1C5DB0" stroke="#FFFFFF" strokeWidth={2} /> },
  {
    ink: '#1F2A33',
    draw: <Path d="M18 3 L34 31 L2 31 Z" fill="#FFFFFF" stroke="#D3262E" strokeWidth={4} strokeLinejoin="round" />,
  },
  { ink: '#FFFFFF', draw: <Rect x={3} y={3} width={30} height={30} rx={5} fill="#239B48" stroke="#FFFFFF" strokeWidth={2} /> },
  {
    ink: '#FFFFFF',
    draw: <Path d="M11 2 L25 2 L34 11 L34 25 L25 34 L11 34 L2 25 L2 11 Z" fill="#D3262E" stroke="#FFFFFF" strokeWidth={2} />,
  },
  {
    ink: '#1F2A33',
    draw: <Path d="M18 2 L34 18 L18 34 L2 18 Z" fill="#FFC20E" stroke="#FFFFFF" strokeWidth={2.5} />,
  },
];

export function SignMarker({ index, letter }: { index: number; letter: string }) {
  const shape = SHAPES[index % SHAPES.length];
  return (
    <View style={styles.wrap}>
      <Svg width={36} height={36} viewBox="0 0 36 36">
        {shape.draw}
      </Svg>
      <AppText style={[styles.letter, { color: shape.ink, marginTop: index % SHAPES.length === 1 ? 6 : 0 }]}>
        {letter}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  letter: { position: 'absolute', fontFamily: fonts.black, fontSize: 15, lineHeight: 18 },
});
