/**
 * The 3D mascot in its own little round stage, for lesson and result screens.
 */
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import * as THREE from 'three';

import { Mascot3D, type Mood3D } from './city3d/mascot3d';
import { Canvas } from './city3d/r3f';

const STAGE = { curious: '#FFF4CC', happy: '#DFF7E6', oops: '#FFE4E4' } as const;

export function Mascot3DView({ mood, size = 96, stage = true }: { mood: Mood3D; size?: number; stage?: boolean }) {
  const reduced = useReducedMotion();
  const camera = useMemo(() => {
    const cam = new THREE.PerspectiveCamera(30, 0.82, 0.5, 50);
    cam.position.set(0, 2.3, 8.4);
    cam.lookAt(0, 1.95, 0);
    return cam;
  }, []);
  const background = stage ? STAGE[mood] : '#FFFFFF';
  return (
    <View
      style={[styles.wrap, { width: size, height: size * 1.22, borderRadius: size / 2, backgroundColor: background }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <Canvas flat camera={camera} dpr={[1, 2]} gl={{ antialias: true }} style={StyleSheet.absoluteFill}>
        <color attach="background" args={[background]} />
        <hemisphereLight args={['#FFFFFF', '#C9D6E2', 1.8]} />
        <directionalLight position={[3, 6, 6]} intensity={2.6} />
        <directionalLight position={[-4, 3, 4]} intensity={0.8} color="#CFE3FF" />
        <Mascot3D mood={mood} animate={!reduced} />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
});
