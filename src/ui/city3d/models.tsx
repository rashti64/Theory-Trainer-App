/**
 * 3D models for the city, all built from simple rounded shapes (original art).
 */
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { useFrame } from './r3f';
import { gableRoof, roundedBox } from './shapes';
import type { Building3D, Tree3D } from './world';

export type WindowSpot = { x: number; y: number; z: number; lit: boolean };

/** Street-front building. Returns its window spots through `windowsOf`. */
export function Building({ b }: { b: Building3D }) {
  const bodyH = b.height;
  const cz = b.front - b.depth / 2;
  return (
    <group position={[b.x, 0, cz]}>
      <mesh geometry={roundedBox(b.width, bodyH, b.depth, 0.3)} position={[0, bodyH / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={b.facade} roughness={0.85} />
      </mesh>
      {b.kind === 'house' ? (
        <mesh geometry={gableRoof(b.width + 0.5, 1.8, b.depth + 0.4)} position={[0, bodyH - 0.05, 0]} castShadow>
          <meshStandardMaterial color={b.roof} roughness={0.7} />
        </mesh>
      ) : (
        <mesh geometry={roundedBox(b.width + 0.3, 0.4, b.depth + 0.3, 0.2)} position={[0, bodyH + 0.1, 0]} castShadow>
          <meshStandardMaterial color={b.roof} roughness={0.7} />
        </mesh>
      )}
      {b.kind === 'tower' ? (
        <mesh position={[0, bodyH + 1.1, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.8, 6]} />
          <meshStandardMaterial color="#C7D0D9" />
        </mesh>
      ) : null}
      {b.kind === 'shop' ? (
        <>
          {/* awning */}
          <mesh position={[0, 2.25, b.depth / 2 + 0.45]} rotation={[0.45, 0, 0]} castShadow>
            <boxGeometry args={[b.width - 0.2, 0.08, 1.1]} />
            <meshStandardMaterial color={b.accent} roughness={0.6} />
          </mesh>
          {/* shop window */}
          <mesh position={[-0.35, 1.05, b.depth / 2 + 0.02]}>
            <boxGeometry args={[b.width - 1.6, 1.3, 0.06]} />
            <meshStandardMaterial color="#BFE6FF" roughness={0.15} metalness={0.1} />
          </mesh>
        </>
      ) : null}
      {/* door */}
      <mesh position={[b.kind === 'shop' ? b.width / 2 - 0.7 : 0, 0.75, b.depth / 2 + 0.03]}>
        <boxGeometry args={[0.8, 1.5, 0.08]} />
        <meshStandardMaterial color="#7A4B2E" roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Window spots on a building's front facade. */
export function windowsOf(b: Building3D): WindowSpot[] {
  const spots: WindowSpot[] = [];
  const startY = b.kind === 'shop' ? 2.9 : 1.9;
  const top = b.height - 0.7;
  const cols = Math.max(2, Math.floor((b.width - 0.6) / 1.15));
  const gap = (b.width - cols * 0.62) / (cols + 1);
  let n = 0;
  for (let y = startY; y < top; y += 1.35) {
    for (let c = 0; c < cols; c++) {
      const x = b.x - b.width / 2 + gap + 0.31 + c * (0.62 + gap);
      spots.push({ x, y, z: b.front + 0.04, lit: ((b.lit >> (n % 16)) & 1) === 1 });
      n++;
    }
  }
  return spots;
}

/** All windows of the city in two instanced meshes (glass and lit). */
export function Windows({ spots, glow }: { spots: WindowSpot[]; glow: number }) {
  const lit = useMemo(() => spots.filter((s) => s.lit), [spots]);
  const dark = useMemo(() => spots.filter((s) => !s.lit), [spots]);
  return (
    <>
      <InstancedBoxes items={dark} size={[0.62, 0.78, 0.08]} color={glow > 0.8 ? '#33456A' : '#8FD0FF'} roughness={0.15} />
      <InstancedBoxes
        items={lit}
        size={[0.62, 0.78, 0.08]}
        color={glow > 0.3 ? '#FFE08A' : '#A9DCFF'}
        emissive="#FFC94D"
        emissiveIntensity={glow * 1.4}
        roughness={0.3}
      />
    </>
  );
}

export function InstancedBoxes({
  items,
  size,
  color,
  emissive = '#000000',
  emissiveIntensity = 0,
  roughness = 0.6,
}: {
  items: { x: number; y: number; z: number }[];
  size: [number, number, number];
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    items.forEach((it, i) => {
      m.makeTranslation(it.x, it.y, it.z);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [items]);
  if (items.length === 0) return null;
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, items.length]}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={roughness} />
    </instancedMesh>
  );
}

const TREE_GREENS = ['#3FAE4F', '#56C25E', '#2E9E52', '#6BCB5A'];

/** Low-poly trees, instanced: round crowns on short trunks. */
export function Trees({ trees }: { trees: Tree3D[] }) {
  const trunks = useRef<THREE.InstancedMesh>(null);
  const crowns = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    const c = new THREE.Color();
    trees.forEach((t, i) => {
      s.set(t.scale, t.scale, t.scale);
      p.set(t.x, 0.6 * t.scale, t.z);
      m.compose(p, q, s);
      trunks.current?.setMatrixAt(i, m);
      p.set(t.x, 1.75 * t.scale, t.z);
      q.setFromEuler(new THREE.Euler(0, t.tone * 3, 0));
      m.compose(p, q, s);
      crowns.current?.setMatrixAt(i, m);
      crowns.current?.setColorAt(i, c.set(TREE_GREENS[Math.floor(t.tone * TREE_GREENS.length)]));
      q.identity();
    });
    if (trunks.current) trunks.current.instanceMatrix.needsUpdate = true;
    if (crowns.current) {
      crowns.current.instanceMatrix.needsUpdate = true;
      if (crowns.current.instanceColor) crowns.current.instanceColor.needsUpdate = true;
    }
  }, [trees]);
  return (
    <>
      <instancedMesh ref={trunks} args={[undefined, undefined, trees.length]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 1.2, 6]} />
        <meshStandardMaterial color="#8A5A3B" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, trees.length]} castShadow>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.8} flatShading />
      </instancedMesh>
    </>
  );
}

/** A chunky little car facing +x. About 2.2 m long. */
export function Car({ color, eyes = false, headlights = false }: { color: string; eyes?: boolean; headlights?: boolean }) {
  return (
    <group>
      <mesh geometry={roundedBox(2.2, 0.75, 1.2, 0.32)} position={[0, 0.62, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
      </mesh>
      {/* cabin with glass */}
      <mesh geometry={roundedBox(1.25, 0.62, 1.05, 0.26)} position={[-0.15, 1.2, 0]} castShadow>
        <meshStandardMaterial color="#9FD8FF" roughness={0.1} metalness={0.2} />
      </mesh>
      <mesh geometry={roundedBox(1.15, 0.12, 1.08, 0.2)} position={[-0.15, 1.52, 0]}>
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
      </mesh>
      {eyes ? <Eyes x={0.47} y={1.24} spread={0.24} size={0.15} /> : null}
      {[
        [0.68, 0.62],
        [-0.68, 0.62],
        [0.68, -0.62],
        [-0.68, -0.62],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.3, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.22, 12]} />
          <meshStandardMaterial color="#20262B" roughness={0.9} />
        </mesh>
      ))}
      {[-0.35, 0.35].map((z) => (
        <mesh key={`h${z}`} position={[1.1, 0.68, z]}>
          <sphereGeometry args={[0.11, 10, 8]} />
          <meshStandardMaterial color="#FFF6C4" emissive="#FFE680" emissiveIntensity={headlights ? 2.5 : 0.4} />
        </mesh>
      ))}
      {[-0.38, 0.38].map((z) => (
        <mesh key={`t${z}`} position={[-1.1, 0.7, z]}>
          <boxGeometry args={[0.06, 0.14, 0.24]} />
          <meshStandardMaterial color="#FF4D4F" emissive="#FF2D2D" emissiveIntensity={headlights ? 1.5 : 0.3} />
        </mesh>
      ))}
    </group>
  );
}

/** Cartoon eyes looking forward (+x): white balls with dark pupils. */
function Eyes({ x, y, spread, size }: { x: number; y: number; spread: number; size: number }) {
  return (
    <>
      {[-spread, spread].map((z) => (
        <group key={z} position={[x, y, z]}>
          <mesh scale={[0.6, 1, 1]}>
            <sphereGeometry args={[size, 14, 12]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          <mesh position={[size * 0.45, 0, 0]} scale={[0.5, 1, 1]}>
            <sphereGeometry args={[size * 0.55, 12, 10]} />
            <meshStandardMaterial color="#1F2A33" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/** City bus facing +x, about 5 m long. */
export function Bus() {
  return (
    <group>
      <mesh geometry={roundedBox(5, 1.9, 1.6, 0.4)} position={[0, 1.25, 0]} castShadow>
        <meshStandardMaterial color="#FFC400" roughness={0.4} />
      </mesh>
      {[0.81, -0.81].map((z) => (
        <mesh key={z} position={[-0.1, 1.55, z]}>
          <boxGeometry args={[4.2, 0.62, 0.04]} />
          <meshStandardMaterial color="#9FD8FF" roughness={0.1} />
        </mesh>
      ))}
      <mesh position={[2.51, 1.5, 0]}>
        <boxGeometry args={[0.04, 0.9, 1.3]} />
        <meshStandardMaterial color="#9FD8FF" roughness={0.1} />
      </mesh>
      {[1.6, -1.6].flatMap((x) =>
        [0.72, -0.72].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.36, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.36, 0.36, 0.24, 12]} />
            <meshStandardMaterial color="#20262B" />
          </mesh>
        )),
      )}
    </group>
  );
}

/** A person (about 1.6 m) facing +x. */
export function Person({ shirt, skin, hair }: { shirt: string; skin: string; hair: string }) {
  return (
    <group>
      <mesh position={[0, 0.35, 0.1]}>
        <capsuleGeometry args={[0.09, 0.45, 4, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 0.35, -0.1]}>
        <capsuleGeometry args={[0.09, 0.45, 4, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.4, 4, 10]} />
        <meshStandardMaterial color={shirt} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.48, 0]} castShadow>
        <sphereGeometry args={[0.22, 14, 12]} />
        <meshStandardMaterial color={skin} roughness={0.7} />
      </mesh>
      <mesh position={[-0.03, 1.56, 0]} scale={[1.05, 0.75, 1.05]}>
        <sphereGeometry args={[0.22, 14, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={hair} roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Traffic light on a pole; cycles green → yellow → red. */
export function TrafficLight({ offset = 0 }: { offset?: number }) {
  const red = useRef<THREE.MeshStandardMaterial>(null);
  const yellow = useRef<THREE.MeshStandardMaterial>(null);
  const green = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    const phase = (clock.elapsedTime / 2 + offset) % 4;
    const state = phase < 1.8 ? 'green' : phase < 2.3 ? 'yellow' : 'red';
    if (red.current) red.current.emissiveIntensity = state === 'red' ? 2.2 : 0.05;
    if (yellow.current) yellow.current.emissiveIntensity = state === 'yellow' ? 2.2 : 0.05;
    if (green.current) green.current.emissiveIntensity = state === 'green' ? 2.2 : 0.05;
  });
  return (
    <group>
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 2.8, 8]} />
        <meshStandardMaterial color="#5B6670" />
      </mesh>
      <mesh geometry={roundedBox(0.5, 1.25, 0.45, 0.14)} position={[0, 3.1, 0]} castShadow>
        <meshStandardMaterial color="#2A3036" />
      </mesh>
      {(
        [
          [red, '#FF4D4F', 3.48],
          [yellow, '#FFC400', 3.1],
          [green, '#33D16A', 2.72],
        ] as const
      ).map(([ref, color, y]) => (
        <mesh key={color} position={[0, y, 0.24]}>
          <sphereGeometry args={[0.14, 12, 10]} />
          <meshStandardMaterial ref={ref} color={color} emissive={color} emissiveIntensity={0.05} />
        </mesh>
      ))}
    </group>
  );
}

/** Street lamp; glows in the evening. */
export function StreetLamp({ on }: { on: boolean }) {
  return (
    <group>
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 3.4, 8]} />
        <meshStandardMaterial color="#4F5B66" />
      </mesh>
      <mesh position={[0, 3.45, 0]}>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial color="#FFF6D6" emissive="#FFD27A" emissiveIntensity={on ? 3 : 0.1} />
      </mesh>
    </group>
  );
}

/** Two posts for a town sign; the sign board itself is drawn in the native layer. */
export function SignPosts() {
  return (
    <group>
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} position={[x, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 2.2, 8]} />
          <meshStandardMaterial color="#8D98A3" />
        </mesh>
      ))}
    </group>
  );
}
