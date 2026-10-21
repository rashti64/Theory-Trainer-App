/** A short burst of confetti in the app's road-sign colours. Fires whenever `burst` changes. */
import { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { createRng } from '@/domain/random';

const COLORS = ['#FFC20E', '#1C5DB0', '#239B48', '#D3262E', '#FFFFFF', '#F7C6D9'];
const COUNT = 40;

type Piece = { dx: number; dy: number; spin: number; color: string; w: number; h: number; delay: number };

function ConfettiPiece({ piece, progress, originX, originY }: { piece: Piece; progress: SharedValue<number>; originX: number; originY: number }) {
  const style = useAnimatedStyle(() => {
    const t = Math.max(0, Math.min(1, (progress.value - piece.delay) / (1 - piece.delay)));
    // Burst outwards, then fall with gravity.
    const x = originX + piece.dx * t;
    const y = originY + piece.dy * t + 520 * t * t;
    return {
      opacity: progress.value === 0 || t >= 1 ? 0 : 1 - t * 0.6,
      transform: [{ translateX: x }, { translateY: y }, { rotate: `${piece.spin * t}deg` }],
    };
  });
  return <Animated.View style={[styles.piece, { width: piece.w, height: piece.h, backgroundColor: piece.color }, style]} />;
}

export function Confetti({ burst }: { burst: number }) {
  const reduced = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);

  const pieces = useMemo<Piece[]>(() => {
    const rng = createRng(burst + 7);
    return Array.from({ length: COUNT }, () => {
      const angle = -Math.PI / 2 + (rng() - 0.5) * Math.PI * 1.1;
      const force = 160 + rng() * 260;
      return {
        dx: Math.cos(angle) * force,
        dy: Math.sin(angle) * force,
        spin: (rng() - 0.5) * 900,
        color: COLORS[Math.floor(rng() * COLORS.length)],
        w: 6 + rng() * 6,
        h: 10 + rng() * 8,
        delay: rng() * 0.15,
      };
    });
  }, [burst]);

  useEffect(() => {
    if (burst === 0 || reduced) return;
    progress.value = 0.0001;
    progress.value = withTiming(1, { duration: 1700, easing: Easing.out(Easing.quad) });
  }, [burst, progress, reduced]);

  if (burst === 0 || reduced) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((p, i) => (
        <ConfettiPiece key={i} piece={p} progress={progress} originX={width / 2} originY={height * 0.55} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute', left: 0, top: 0, borderRadius: 2 },
});
