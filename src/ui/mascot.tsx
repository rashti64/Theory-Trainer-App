/**
 * The mascot: a friendly traffic light whose lit lamp is its face.
 * Yellow = curious (thinking about the question), green = happy, red = oops.
 * Original character, drawn in SVG.
 */
import { useEffect, useState } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

export type Mood = 'curious' | 'happy' | 'oops';

const LAMPS = {
  red: { on: '#FF4D4F', off: '#5A2E31', cy: 26 },
  yellow: { on: '#FFC20E', off: '#5A4A22', cy: 58 },
  green: { on: '#33D16A', off: '#21452D', cy: 90 },
} as const;

const MOOD_LAMP: Record<Mood, keyof typeof LAMPS> = { oops: 'red', curious: 'yellow', happy: 'green' };

export function Mascot({ mood, size = 96 }: { mood: Mood; size?: number }) {
  const reduced = useReducedMotion();
  const [blink, setBlink] = useState(false);
  const bob = useSharedValue(0);
  const jump = useSharedValue(0);
  const shake = useSharedValue(0);

  // Idle breathing.
  useEffect(() => {
    if (reduced) return;
    bob.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [bob, reduced]);

  // React to the mood: jump for joy, or a little shake.
  useEffect(() => {
    if (reduced) return;
    if (mood === 'happy') {
      jump.value = withSequence(withTiming(-18, { duration: 180, easing: Easing.out(Easing.quad) }), withSpring(0, { damping: 6 }));
    } else if (mood === 'oops') {
      shake.value = withSequence(
        withTiming(-6, { duration: 60 }),
        withTiming(6, { duration: 80 }),
        withTiming(-4, { duration: 70 }),
        withTiming(4, { duration: 70 }),
        withTiming(0, { duration: 60 }),
      );
    }
  }, [jump, mood, reduced, shake]);

  // Blink now and then.
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3200);
    return () => clearInterval(id);
  }, [reduced]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value + jump.value }, { translateX: shake.value }],
  }));

  const active = MOOD_LAMP[mood];
  const face = LAMPS[active];
  const armsUp = mood === 'happy';
  const armsDown = mood === 'oops';

  return (
    <Animated.View style={style} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width={size} height={(size * 132) / 96} viewBox="0 0 96 132">
        {/* legs */}
        <Line x1={38} y1={112} x2={36} y2={124} stroke="#2A3036" strokeWidth={5} strokeLinecap="round" />
        <Line x1={58} y1={112} x2={60} y2={124} stroke="#2A3036" strokeWidth={5} strokeLinecap="round" />
        <Rect x={27} y={121} width={14} height={7} rx={3.5} fill="#1C5DB0" />
        <Rect x={55} y={121} width={14} height={7} rx={3.5} fill="#1C5DB0" />
        {/* arms */}
        <Path
          d={armsUp ? 'M24 54 Q12 40 10 26' : armsDown ? 'M24 60 Q16 74 15 84' : 'M24 58 Q12 64 12 76'}
          stroke="#2A3036"
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d={armsUp ? 'M72 54 Q84 40 86 26' : armsDown ? 'M72 60 Q80 74 81 84' : 'M72 58 Q84 52 88 42'}
          stroke="#2A3036"
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx={armsUp ? 10 : armsDown ? 15 : 12} cy={armsUp ? 24 : armsDown ? 86 : 78} r={5} fill="#FFFFFF" stroke="#2A3036" strokeWidth={2} />
        <Circle cx={armsUp ? 86 : armsDown ? 81 : 88} cy={armsUp ? 24 : armsDown ? 86 : 40} r={5} fill="#FFFFFF" stroke="#2A3036" strokeWidth={2} />
        {/* housing */}
        <Rect x={24} y={6} width={48} height={108} rx={14} fill="#2F3A45" />
        <Rect x={28} y={10} width={40} height={100} rx={11} fill="#38444F" />
        {(Object.keys(LAMPS) as (keyof typeof LAMPS)[]).map((key) => {
          const lamp = LAMPS[key];
          const lit = key === active;
          return (
            <G key={key}>
              {/* visor over each lamp */}
              <Path d={`M30 ${lamp.cy - 12} Q48 ${lamp.cy - 22} 66 ${lamp.cy - 12}`} stroke="#222A31" strokeWidth={4} fill="none" strokeLinecap="round" />
              {lit ? <Circle cx={48} cy={lamp.cy} r={17} fill={lamp.on} opacity={0.3} /> : null}
              <Circle cx={48} cy={lamp.cy} r={13} fill={lit ? lamp.on : lamp.off} />
            </G>
          );
        })}
        {/* face inside the lit lamp */}
        <G>
          {blink ? (
            <>
              <Line x1={40} y1={face.cy - 2} x2={45} y2={face.cy - 2} stroke="#1F2A33" strokeWidth={2} strokeLinecap="round" />
              <Line x1={51} y1={face.cy - 2} x2={56} y2={face.cy - 2} stroke="#1F2A33" strokeWidth={2} strokeLinecap="round" />
            </>
          ) : (
            <>
              <Circle cx={42.5} cy={face.cy - 2.5} r={3.3} fill="#FFFFFF" />
              <Circle cx={53.5} cy={face.cy - 2.5} r={3.3} fill="#FFFFFF" />
              <Circle cx={43.3} cy={face.cy - 2} r={1.7} fill="#1F2A33" />
              <Circle cx={54.3} cy={face.cy - 2} r={1.7} fill="#1F2A33" />
            </>
          )}
          {mood === 'happy' ? (
            <Path d={`M42 ${face.cy + 3} Q48 ${face.cy + 10} 54 ${face.cy + 3}`} stroke="#1F2A33" strokeWidth={2.2} fill="#1F2A33" strokeLinecap="round" />
          ) : mood === 'oops' ? (
            <Path d={`M43 ${face.cy + 7} Q48 ${face.cy + 2} 53 ${face.cy + 7}`} stroke="#1F2A33" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          ) : (
            <Circle cx={48} cy={face.cy + 5.5} r={2.4} fill="#1F2A33" />
          )}
        </G>
      </Svg>
    </Animated.View>
  );
}
