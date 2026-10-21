/** Lesson progress as a road: a little car drives towards the chequered flag. */
import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';

import { TopCar } from './sprites';
import { colors } from './theme';

const CAR_W = 36;
const FLAG_W = 18;

function Flag() {
  const cells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      cells.push(<Rect key={`${r}-${c}`} x={c * 6} y={r * 6} width={6} height={6} fill={(r + c) % 2 ? '#1F2A33' : '#FFFFFF'} />);
    }
  }
  return (
    <Svg width={FLAG_W} height={24} viewBox="0 0 18 24">
      {cells}
    </Svg>
  );
}

export function RoadProgress({ value }: { value: number }) {
  const [width, setWidth] = useState(0);
  const x = useSharedValue(0);
  const track = Math.max(0, width - CAR_W - FLAG_W - 4);

  useEffect(() => {
    x.value = withSpring(Math.max(0, Math.min(1, value)) * track, { damping: 14, stiffness: 120 });
  }, [track, value, x]);

  const car = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const trail = useAnimatedStyle(() => ({ width: x.value + CAR_W / 2 }));

  return (
    <View
      style={styles.road}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}>
      <View style={styles.dashes}>
        {Array.from({ length: 14 }, (_, i) => (
          <View key={i} style={styles.dash} />
        ))}
      </View>
      <Animated.View style={[styles.trail, trail]} />
      <View style={styles.flag}>
        <Flag />
      </View>
      <Animated.View style={[styles.car, car]}>
        <TopCar color={colors.red} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  road: {
    flex: 1,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#5B6570',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dashes: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10 },
  dash: { width: 10, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.7)' },
  trail: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: 'rgba(51,209,106,0.45)' },
  flag: { position: 'absolute', right: 8 },
  car: { position: 'absolute', left: 2 },
});
