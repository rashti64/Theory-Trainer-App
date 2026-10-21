/**
 * The mascot in 3D: a friendly traffic light whose lit lamp is its face.
 * curious = yellow lamp, happy = green lamp, oops = red lamp.
 * Faces +z (towards the camera). Feet at y = 0, about 3.4 m tall.
 */
import { useRef } from 'react';
import * as THREE from 'three';

import { useFrame } from './r3f';
import { roundedBox } from './shapes';

export type Mood3D = 'curious' | 'happy' | 'oops';

const LAMPS = [
  { key: 'oops', color: '#FF4D4F', off: '#5A2E31', y: 0.78 },
  { key: 'curious', color: '#FFC400', off: '#5A4A22', y: 0 },
  { key: 'happy', color: '#33D16A', off: '#21452D', y: -0.78 },
] as const;

export function Mascot3D({ mood, animate = true }: { mood: Mood3D; animate?: boolean }) {
  const root = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const moodSince = useRef({ mood, t: -1 });

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (moodSince.current.mood !== mood || moodSince.current.t < 0) moodSince.current = { mood, t };
    const since = t - moodSince.current.t;
    if (!root.current) return;
    if (!animate) return;

    let y = Math.sin(t * 2.2) * 0.05;
    let x = 0;
    if (mood === 'happy') y += Math.max(0, Math.sin(Math.min(since, 0.6) * Math.PI / 0.6)) * 0.7 + Math.abs(Math.sin(t * 5)) * 0.08;
    if (mood === 'oops' && since < 0.6) x = Math.sin(since * 40) * 0.12 * (1 - since / 0.6);
    root.current.position.y = y;
    root.current.position.x = x;
    root.current.rotation.y = Math.sin(t * 0.8) * 0.12;

    const wave = Math.sin(t * 7) * 0.35;
    if (leftArm.current && rightArm.current) {
      // The arm hangs down from the shoulder; negative z turns the left arm outwards.
      if (mood === 'happy') {
        leftArm.current.rotation.z = -2.5 - wave;
        rightArm.current.rotation.z = 2.5 + wave;
      } else if (mood === 'oops') {
        // Hands on the "head": a little facepalm shrug.
        leftArm.current.rotation.z = -0.45;
        rightArm.current.rotation.z = 0.45;
      } else {
        leftArm.current.rotation.z = -0.6;
        rightArm.current.rotation.z = 2.2 + wave * 0.6;
      }
    }
    if (eyes.current) {
      const blink = t % 3.4 < 0.12;
      eyes.current.scale.y = blink ? 0.12 : 1;
    }
  });

  const active = LAMPS.find((l) => l.key === mood)!;
  const bodyY = 2.15;

  return (
    <group ref={root}>
      {/* legs and feet */}
      {[-0.28, 0.28].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.45, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.7, 8]} />
            <meshStandardMaterial color="#2A3036" />
          </mesh>
          <mesh geometry={roundedBox(0.42, 0.22, 0.6, 0.1)} position={[x, 0.11, 0.1]} castShadow>
            <meshStandardMaterial color="#2B70E4" roughness={0.5} />
          </mesh>
        </group>
      ))}
      {/* arms: pivot at the shoulder */}
      {[
        [leftArm, -0.62],
        [rightArm, 0.62],
      ].map(([ref, x]) => (
        <group key={String(x)} ref={ref as React.RefObject<THREE.Group>} position={[x as number, bodyY + 0.3, 0]}>
          <mesh position={[0, -0.45, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.9, 8]} />
            <meshStandardMaterial color="#3C4A57" />
          </mesh>
          <mesh position={[0, -0.95, 0]}>
            <sphereGeometry args={[0.16, 12, 10]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
          </mesh>
        </group>
      ))}
      {/* housing */}
      <mesh geometry={roundedBox(1.15, 2.65, 0.9, 0.35)} position={[0, bodyY, 0]} castShadow>
        <meshStandardMaterial color="#2F3A45" roughness={0.45} metalness={0.1} />
      </mesh>
      {LAMPS.map((lamp) => {
        const lit = lamp.key === mood;
        return (
          <group key={lamp.key} position={[0, bodyY + lamp.y, 0.42]}>
            {/* visor */}
            <mesh position={[0, 0.22, 0.08]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.33, 0.05, 6, 16, Math.PI]} />
              <meshStandardMaterial color="#1F262C" />
            </mesh>
            <mesh scale={[1, 1, 0.55]}>
              <sphereGeometry args={[0.3, 20, 16]} />
              <meshStandardMaterial
                color={lit ? lamp.color : lamp.off}
                emissive={lit ? lamp.color : '#000000'}
                emissiveIntensity={lit ? 0.9 : 0}
                roughness={0.35}
              />
            </mesh>
          </group>
        );
      })}
      {/* face on the lit lamp */}
      <group position={[0, bodyY + active.y, 0.6]}>
        <group ref={eyes} position={[0, 0.05, 0]}>
          {[-0.1, 0.1].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <mesh>
                <sphereGeometry args={[0.075, 12, 10]} />
                <meshStandardMaterial color="#FFFFFF" />
              </mesh>
              <mesh position={[0.01, -0.005, 0.05]}>
                <sphereGeometry args={[0.04, 10, 8]} />
                <meshStandardMaterial color="#1F2A33" />
              </mesh>
            </group>
          ))}
        </group>
        {mood === 'curious' ? (
          <mesh position={[0, -0.12, 0]}>
            <sphereGeometry args={[0.045, 10, 8]} />
            <meshStandardMaterial color="#1F2A33" />
          </mesh>
        ) : (
          <mesh position={[0, mood === 'happy' ? -0.06 : -0.17, 0]} rotation={[0, 0, mood === 'happy' ? Math.PI : 0]}>
            <torusGeometry args={[0.09, 0.022, 6, 14, Math.PI]} />
            <meshStandardMaterial color="#1F2A33" />
          </mesh>
        )}
      </group>
    </group>
  );
}
