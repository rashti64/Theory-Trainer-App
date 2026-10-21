/**
 * Small SVG drawings used on the city map. All original artwork.
 */
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

/** Car seen from above, facing right. 36 × 20. */
export function TopCar({ color, roof = 'rgba(0,0,0,0.18)' }: { color: string; roof?: string }) {
  return (
    <Svg width={36} height={20} viewBox="0 0 36 20">
      {/* wheels */}
      <Rect x={6} y={0} width={7} height={3} rx={1} fill="#20262B" />
      <Rect x={23} y={0} width={7} height={3} rx={1} fill="#20262B" />
      <Rect x={6} y={17} width={7} height={3} rx={1} fill="#20262B" />
      <Rect x={23} y={17} width={7} height={3} rx={1} fill="#20262B" />
      {/* body */}
      <Rect x={1} y={2} width={34} height={16} rx={6} fill={color} />
      <Rect x={10} y={4} width={15} height={12} rx={3} fill={roof} />
      {/* windscreen and rear window */}
      <Path d="M25 4.5 L29 6 L29 14 L25 15.5 Z" fill="#CFE6F7" />
      <Path d="M10 4.5 L7.5 6 L7.5 14 L10 15.5 Z" fill="#CFE6F7" />
      {/* lights */}
      <Rect x={33} y={4} width={2} height={3} rx={1} fill="#FFF3B0" />
      <Rect x={33} y={13} width={2} height={3} rx={1} fill="#FFF3B0" />
      <Rect x={1} y={4} width={1.6} height={3} rx={0.8} fill="#E5484D" />
      <Rect x={1} y={13} width={1.6} height={3} rx={0.8} fill="#E5484D" />
    </Svg>
  );
}

/** Bus seen from above, facing right. 64 × 22. */
export function TopBus() {
  return (
    <Svg width={64} height={22} viewBox="0 0 64 22">
      <Rect x={1} y={1} width={62} height={20} rx={4} fill="#FFC20E" />
      <Rect x={6} y={4} width={50} height={14} rx={2} fill="#F0B000" />
      {[10, 20, 30, 40].map((x) => (
        <Rect key={x} x={x} y={6} width={6} height={10} rx={1} fill="#FFDB66" />
      ))}
      <Rect x={57} y={3} width={4} height={16} rx={1.5} fill="#CFE6F7" />
    </Svg>
  );
}

/** A person seen from the side, walking right. 16 × 30. */
export function Walker({ shirt, skin, hair, legPhase }: { shirt: string; skin: string; hair: string; legPhase: 0 | 1 }) {
  const front = legPhase === 0 ? 'M8 21 L11 29' : 'M8 21 L8.5 29';
  const back = legPhase === 0 ? 'M8 21 L5 29' : 'M8 21 L7.5 29';
  return (
    <Svg width={16} height={30} viewBox="0 0 16 30">
      <Path d={back} stroke="#2F3A45" strokeWidth={2.6} strokeLinecap="round" />
      <Path d={front} stroke="#3B4A58" strokeWidth={2.6} strokeLinecap="round" />
      <Rect x={4} y={10} width={8} height={12} rx={3.5} fill={shirt} />
      <Circle cx={8} cy={6} r={4.2} fill={skin} />
      <Path d="M3.8 5.5 A4.2 4.2 0 0 1 12.2 5 L11 4 Q8 2.5 5 4.2 Z" fill={hair} />
      <Circle cx={10.2} cy={6} r={0.7} fill="#2A3036" />
    </Svg>
  );
}

export type LightState = 'red' | 'yellow' | 'green';

/** Traffic light on a post. 16 × 54. */
export function TrafficLightSprite({ state }: { state: LightState }) {
  const on = (c: LightState) => state === c;
  return (
    <Svg width={16} height={54} viewBox="0 0 16 54">
      <Rect x={7} y={26} width={2.5} height={28} fill="#5B6670" />
      <Rect x={1} y={0} width={14} height={30} rx={4} fill="#2A3036" />
      <Circle cx={8} cy={6.5} r={3.6} fill={on('red') ? '#FF4D4F' : '#4A2A2C'} />
      <Circle cx={8} cy={15} r={3.6} fill={on('yellow') ? '#FFC20E' : '#4A3F22'} />
      <Circle cx={8} cy={23.5} r={3.6} fill={on('green') ? '#3DDC6A' : '#22402B'} />
    </Svg>
  );
}

/** Cute car seen from the side, with eyes in the windscreen. Drawn in a 48 × 32 box. */
export function StepCar({
  body,
  window = '#1F2A33',
  wheel = '#20262B',
  eyes = true,
  size = 48,
}: {
  body: string;
  window?: string;
  wheel?: string;
  eyes?: boolean;
  size?: number;
}) {
  return (
    <Svg width={size} height={(size * 32) / 48} viewBox="0 0 48 32">
      <Path
        d="M5 22 Q4 15 10 14 L14 7 Q15.5 5 18 5 L31 5 Q33.5 5 35 7.5 L38.5 13.5 Q44 14.5 44 20 L44 23 Q44 25 42 25 L6 25 Q4.5 25 5 22 Z"
        fill={body}
      />
      <Path d="M16.5 8 L30.5 8 Q32 8 32.8 9.3 L35.5 14 L13.5 14 L15.5 9.2 Q16 8 16.5 8 Z" fill={window} />
      {eyes ? (
        <G>
          <Ellipse cx={21} cy={11} rx={2.6} ry={2.8} fill="#FFFFFF" />
          <Ellipse cx={28} cy={11} rx={2.6} ry={2.8} fill="#FFFFFF" />
          <Circle cx={21.8} cy={11.4} r={1.3} fill="#1F2A33" />
          <Circle cx={28.8} cy={11.4} r={1.3} fill="#1F2A33" />
        </G>
      ) : null}
      <Rect x={41} y={17} width={3} height={3} rx={1.2} fill="#FFE27A" />
      <Line x1={6} y1={19.5} x2={41} y2={19.5} stroke="rgba(0,0,0,0.12)" strokeWidth={1.4} />
      <Circle cx={14} cy={25} r={5} fill={wheel} />
      <Circle cx={14} cy={25} r={2} fill="#C7CED5" />
      <Circle cx={35} cy={25} r={5} fill={wheel} />
      <Circle cx={35} cy={25} r={2} fill="#C7CED5" />
    </Svg>
  );
}

/** Fluffy cloud. 70 × 30. */
export function Cloud({ opacity = 0.95 }: { opacity?: number }) {
  return (
    <Svg width={70} height={30} viewBox="0 0 70 30">
      <G fill="#FFFFFF" opacity={opacity}>
        <Circle cx={20} cy={18} r={11} />
        <Circle cx={35} cy={13} r={13} />
        <Circle cx={50} cy={18} r={10} />
        <Rect x={12} y={18} width={46} height={11} rx={5.5} />
      </G>
    </Svg>
  );
}

/** Puff of exhaust. 12 × 12. */
export function Puff() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12">
      <Circle cx={6} cy={6} r={5} fill="#E3E8EC" />
    </Svg>
  );
}
