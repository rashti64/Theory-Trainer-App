/**
 * The 3D city scene: light that follows the real time of day, roads,
 * street fronts, trees, traffic, people, traffic lights, floating lesson
 * pads with their cars, and the mascot cheering at the current lesson.
 */
import { memo, useMemo, useRef } from 'react';
import * as THREE from 'three';

import type { UnitColor } from '../theme';
import { Mascot3D } from './mascot3d';
import { Building, Bus, Car, InstancedBoxes, Person, SignPosts, StreetLamp, TrafficLight, Trees, Windows, windowsOf } from './models';
import { useFrame } from './r3f';
import { roundedBox } from './shapes';
import type { Lighting } from './time-of-day';
import {
  CONNECTOR_X,
  cityBlocks,
  cityDepth,
  HALF_W,
  lanes,
  ROAD_W,
  roads,
  rowZ,
  SIDEWALK_W,
  signPosition,
  stops,
  type Stop3D,
} from './world';

export type PadState = 'done' | 'next' | 'open' | 'locked';

export type DistrictInfo = { color: UnitColor; pads: PadState[] };

const PAD_COLORS: Record<UnitColor, { fill: string; edge: string }> = {
  blue: { fill: '#2B70E4', edge: '#1A4FB0' },
  yellow: { fill: '#FF8A00', edge: '#C96400' },
  green: { fill: '#2FBF5B', edge: '#1F9445' },
  slate: { fill: '#8B5CF6', edge: '#6A3FD1' },
};
const GOLD = { fill: '#FFC400', edge: '#D99A00' };
const LOCKED = { fill: '#B8C1CA', edge: '#8F99A3' };

const CAR_COLORS = ['#FF4D4F', '#2B70E4', '#FFFFFF', '#2FBF5B', '#FF8A00', '#8B5CF6', '#14B8A6', '#FFC400'];
const PEOPLE = [
  { shirt: '#FF4D4F', skin: '#F2C8A0', hair: '#3B2A20' },
  { shirt: '#2B70E4', skin: '#8D5B3E', hair: '#1F1A17' },
  { shirt: '#FFC400', skin: '#E7B48F', hair: '#A0522D' },
  { shirt: '#2FBF5B', skin: '#C68A62', hair: '#2B2B2B' },
  { shirt: '#8B5CF6', skin: '#F5D3B5', hair: '#E3B341' },
];

const ASPHALT = '#59636E';
const SIDEWALK = '#E3E8EE';
const PAD_HEIGHT = 2.5;
const SPAN = 52;

export const CityScene = memo(function CityScene({
  districts,
  lighting,
  camera,
  motion,
}: {
  districts: DistrictInfo[];
  lighting: Lighting;
  camera: THREE.PerspectiveCamera;
  motion: boolean;
}) {
  const units = districts.length;
  const blocks = useMemo(() => districts.map((_, u) => cityBlocks(u, units)), [districts, units]);
  const allTrees = useMemo(() => blocks.flatMap((b) => b.trees), [blocks]);
  const allWindows = useMemo(() => blocks.flatMap((b) => b.buildings.flatMap(windowsOf)), [blocks]);
  const markings = useMemo(() => roadMarkings(units), [units]);
  const sidewalks = useMemo(() => sidewalkStrips(units), [units]);
  const depth = cityDepth(units);

  const current = useMemo(() => {
    for (let u = 0; u < units; u++) {
      const i = districts[u].pads.indexOf('next');
      if (i >= 0) return stops(u)[i];
    }
    return null;
  }, [districts, units]);

  return (
    <>
      <color attach="background" args={[lighting.sky]} />
      <fog attach="fog" args={[lighting.sky, lighting.fogNear, lighting.fogFar]} />
      <FogRig lighting={lighting} camera={camera} />
      <hemisphereLight args={[lighting.hemiSky, lighting.hemiGround, lighting.hemiIntensity]} />
      <SunRig lighting={lighting} camera={camera} />

      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, (depth.near + depth.far) / 2]} receiveShadow>
        <planeGeometry args={[120, depth.near - depth.far + 120]} />
        <meshStandardMaterial color={lighting.mood === 'night' ? '#3D6B45' : '#8FD46E'} roughness={1} />
      </mesh>

      {/* roads */}
      {districts.map((_, u) => {
        const r = roads(u, units);
        return [...r.streets, ...r.connectors].map((s, i) => (
          <mesh key={`${u}-${i}`} position={[s.x, 0.04, s.z]} receiveShadow>
            <boxGeometry args={[s.w, 0.08, s.d]} />
            <meshStandardMaterial color={ASPHALT} roughness={0.95} />
          </mesh>
        ));
      })}
      {sidewalks.map((s, i) => (
        <mesh key={`sw${i}`} geometry={roundedBox(s.w, 0.24, s.d, 0.12)} position={[s.x, 0.12, s.z]} receiveShadow>
          <meshStandardMaterial color={SIDEWALK} roughness={0.9} />
        </mesh>
      ))}
      <InstancedBoxes items={markings.dashesX} size={[1.3, 0.02, 0.2]} color="#FFFFFF" roughness={0.6} />
      <InstancedBoxes items={markings.dashesZ} size={[0.2, 0.02, 1.3]} color="#FFFFFF" roughness={0.6} />
      <InstancedBoxes items={markings.zebra} size={[2.4, 0.02, 0.42]} color="#FFFFFF" roughness={0.6} />

      {/* buildings, windows, trees */}
      {blocks.map((b, u) => b.buildings.map((bd, i) => <Building key={`${u}-${i}`} b={bd} />))}
      <Windows spots={allWindows} glow={lighting.windowGlow} />
      <Trees trees={allTrees} />

      {districts.map((d, u) => (
        <group key={`d${u}`}>
          <group position={[signPosition(u).x, 0, signPosition(u).z]}>
            <SignPosts />
          </group>
          <group position={[CONNECTOR_X - ROAD_W / 2 - 0.7, 0.24, rowZ(u, 0) - ROAD_W / 2 - 0.7]}>
            <TrafficLight offset={u * 0.7} />
          </group>
          {u < units - 1 ? (
            <group position={[-CONNECTOR_X + ROAD_W / 2 + 0.7, 0.24, rowZ(u, 1) - ROAD_W / 2 - 0.7]}>
              <TrafficLight offset={u * 0.7 + 1.3} />
            </group>
          ) : null}
          {[-7, 0.8, 7.5].map((x) => (
            <group key={x} position={[x, 0.24, rowZ(u, 0) + ROAD_W / 2 + SIDEWALK_W / 2]}>
              <StreetLamp on={lighting.headlights} />
            </group>
          ))}
          <DistrictTraffic unit={u} motion={motion} headlights={lighting.headlights} />
          <Walkers unit={u} motion={motion} />
          {stops(u).map((s, i) => (
            <LessonPad key={i} stop={s} state={d.pads[i]} color={d.color} motion={motion} />
          ))}
        </group>
      ))}

      {current ? (
        <group position={[current.x + (current.facing === 1 ? -3.1 : 3.1), 0.24, current.z + ROAD_W / 2 + SIDEWALK_W / 2 + 0.1]} scale={1.5}>
          <Mascot3D mood="happy" animate={motion} />
        </group>
      ) : null}
    </>
  );
});

/** Keep the haze just beyond what is on screen, whatever the camera distance. */
function FogRig({ lighting, camera }: { lighting: Lighting; camera: THREE.PerspectiveCamera }) {
  useFrame(({ scene }) => {
    const fog = scene.fog as THREE.Fog | null;
    if (!fog) return;
    const focus = (camera.userData.target as THREE.Vector3 | undefined) ?? new THREE.Vector3();
    const d = camera.position.distanceTo(focus);
    fog.near = d + lighting.fogNear - 30;
    fog.far = d + lighting.fogFar - 30;
  });
  return null;
}

/** Warm sun with soft shadows that follows the part of the city on screen. */
function SunRig({ lighting, camera }: { lighting: Lighting; camera: THREE.PerspectiveCamera }) {
  const light = useRef<THREE.DirectionalLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  const dir = useMemo(() => new THREE.Vector3(...lighting.sunFrom).normalize().multiplyScalar(40), [lighting.sunFrom]);
  useFrame(() => {
    const focus = (camera.userData.target as THREE.Vector3 | undefined) ?? new THREE.Vector3();
    target.position.set(0, 0, focus.z);
    target.updateMatrixWorld();
    light.current?.position.set(dir.x, dir.y, focus.z + dir.z);
  });
  return (
    <>
      <primitive object={target} />
      <directionalLight
        ref={light}
        color={lighting.sun}
        intensity={lighting.sunIntensity}
        target={target}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={1}
        shadow-camera-far={110}
        shadow-bias={-0.0005}
      />
    </>
  );
}

function LessonPad({ stop, state, color, motion }: { stop: Stop3D; state: PadState; color: UnitColor; motion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const isNext = state === 'next';
  const palette = state === 'locked' ? LOCKED : state === 'done' ? GOLD : PAD_COLORS[color];
  const scale = isNext ? 1.45 : 1.22;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + stop.index;
    if (group.current) {
      group.current.position.y = PAD_HEIGHT + (motion ? Math.sin(t * (isNext ? 3.2 : 1.4)) * (isNext ? 0.28 : 0.1) : 0);
      if (isNext && motion) group.current.rotation.y = Math.sin(t * 1.2) * 0.25;
    }
    if (ring.current) {
      const p = motion ? (clock.elapsedTime % 1.6) / 1.6 : 0.3;
      ring.current.scale.setScalar(1 + p * 0.8);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - p);
    }
  });

  return (
    <group position={[stop.x, 0, stop.z]}>
      {/* soft contact shadow on the road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <circleGeometry args={[1.3 * scale, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.16} />
      </mesh>
      <group ref={group} position={[0, PAD_HEIGHT, 0]} scale={scale}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <cylinderGeometry args={[1.55, 1.45, 0.3, 32]} />
          <meshStandardMaterial color={palette.edge} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.22, 32]} />
          <meshStandardMaterial color={palette.fill} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.32, 0.07, 8, 40]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Turn the car three-quarters towards the camera so its eyes show. */}
        <group position={[0, 0.12, 0]} rotation={[0, stop.facing === 1 ? -0.95 : -Math.PI + 0.95, 0]} scale={0.9}>
          <Car color={state === 'locked' ? '#DDE3E8' : '#FFFFFF'} eyes={state !== 'locked'} />
        </group>
        {isNext ? (
          <mesh ref={ring} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.6, 0.09, 8, 40]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.6} />
          </mesh>
        ) : null}
      </group>
    </group>
  );
}

type Mover = { kind: 'car' | 'bus'; axis: 'x' | 'z'; dir: 1 | -1; lane: number; from?: number; to?: number; speed: number; phase: number; color: string };

function DistrictTraffic({ unit, motion, headlights }: { unit: number; motion: boolean; headlights: boolean }) {
  const l = lanes(unit);
  const movers: Mover[] = useMemo(
    () => [
      { kind: 'car', axis: 'x', dir: 1, lane: l.eastbound[0], speed: 4.6, phase: (unit * 0.31) % 1, color: CAR_COLORS[unit % 8] },
      { kind: 'car', axis: 'x', dir: 1, lane: l.eastbound[0], speed: 4.6, phase: (unit * 0.31 + 0.5) % 1, color: CAR_COLORS[(unit + 3) % 8] },
      { kind: 'car', axis: 'x', dir: -1, lane: l.westbound[0], speed: 4.1, phase: (unit * 0.47 + 0.2) % 1, color: CAR_COLORS[(unit + 5) % 8] },
      { kind: 'car', axis: 'x', dir: 1, lane: l.eastbound[1], speed: 4.3, phase: (unit * 0.23 + 0.7) % 1, color: CAR_COLORS[(unit + 1) % 8] },
      { kind: 'bus', axis: 'x', dir: -1, lane: l.westbound[1], speed: 3.4, phase: (unit * 0.19) % 1, color: '' },
      { kind: 'car', axis: 'z', dir: -1, lane: l.northbound.x, from: l.northbound.from + 2, to: l.northbound.to - 2, speed: 3.6, phase: (unit * 0.37) % 1, color: CAR_COLORS[(unit + 6) % 8] },
    ],
    [l.eastbound, l.westbound, l.northbound.from, l.northbound.to, l.northbound.x, unit],
  );
  const refs = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }) => {
    const t = motion ? clock.elapsedTime : 0;
    movers.forEach((m, i) => {
      const g = refs.current[i];
      if (!g) return;
      if (m.axis === 'x') {
        const p = (t * m.speed / SPAN + m.phase) % 1;
        g.position.set(m.dir === 1 ? -SPAN / 2 + p * SPAN : SPAN / 2 - p * SPAN, 0.08, m.lane);
      } else {
        const length = (m.from ?? 0) - (m.to ?? 0);
        const p = (t * m.speed / length + m.phase) % 1;
        g.position.set(m.lane, 0.08, (m.from ?? 0) - p * length);
        // Fade in and out at the junctions by sinking, so cars don't pop.
        g.scale.setScalar(Math.min(1, p * 8, (1 - p) * 8));
      }
    });
  });

  return (
    <>
      {movers.map((m, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          rotation={[0, m.axis === 'z' ? Math.PI / 2 : m.dir === 1 ? 0 : Math.PI, 0]}>
          {m.kind === 'bus' ? <Bus /> : <Car color={m.color} headlights={headlights} />}
        </group>
      ))}
    </>
  );
}

function Walkers({ unit, motion }: { unit: number; motion: boolean }) {
  const walkers = useMemo(
    () =>
      [0, 1].flatMap((row) => [
        { z: rowZ(unit, row as 0 | 1) - ROAD_W / 2 - SIDEWALK_W / 2, dir: 1 as const, phase: (unit * 0.41 + row * 0.3) % 1, look: PEOPLE[(unit + row) % 5] },
        { z: rowZ(unit, row as 0 | 1) - ROAD_W / 2 - SIDEWALK_W / 2, dir: -1 as const, phase: (unit * 0.63 + row * 0.5) % 1, look: PEOPLE[(unit + row + 2) % 5] },
        { z: rowZ(unit, row as 0 | 1) + ROAD_W / 2 + SIDEWALK_W / 2, dir: 1 as const, phase: (unit * 0.27 + row * 0.8) % 1, look: PEOPLE[(unit + row + 4) % 5] },
      ]),
    [unit],
  );
  const refs = useRef<(THREE.Group | null)[]>([]);
  const span = HALF_W * 2 + 6;
  useFrame(({ clock }) => {
    const t = motion ? clock.elapsedTime : 0;
    walkers.forEach((w, i) => {
      const g = refs.current[i];
      if (!g) return;
      const p = (t * 1.3 / span + w.phase) % 1;
      const x = w.dir === 1 ? -span / 2 + p * span : span / 2 - p * span;
      g.position.set(x, 0.24 + Math.abs(Math.sin(t * 7 + i)) * 0.08, w.z);
    });
  });
  return (
    <>
      {walkers.map((w, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          rotation={[0, w.dir === 1 ? 0 : Math.PI, 0]}>
          <Person {...w.look} />
        </group>
      ))}
    </>
  );
}

/** Centre-line dashes and zebra crossings. */
function roadMarkings(units: number) {
  const dashesX: { x: number; y: number; z: number }[] = [];
  const dashesZ: { x: number; y: number; z: number }[] = [];
  const zebra: { x: number; y: number; z: number }[] = [];
  const nearConnector = (x: number) => Math.abs(Math.abs(x) - CONNECTOR_X) < ROAD_W / 2 + 0.6;
  for (let u = 0; u < units; u++) {
    for (const row of [0, 1] as const) {
      const z = rowZ(u, row);
      for (let x = -24; x <= 24; x += 2.6) {
        if (nearConnector(x) || Math.abs(x) < 1.8) continue;
        dashesX.push({ x, y: 0.09, z });
      }
      for (let i = 0; i < 5; i++) zebra.push({ x: 0, y: 0.09, z: z - ROAD_W / 2 + 0.55 + i * 0.97 });
    }
    const r = roads(u, units);
    for (const c of r.connectors) {
      for (let z = c.z + c.d / 2 - ROAD_W; z >= c.z - c.d / 2 + ROAD_W; z -= 2.6) dashesZ.push({ x: c.x, y: 0.09, z });
    }
  }
  return { dashesX, dashesZ, zebra };
}

/** Raised sidewalks along streets and connectors, with gaps where roads meet. */
function sidewalkStrips(units: number) {
  const strips: { x: number; z: number; w: number; d: number }[] = [];
  const edge = ROAD_W / 2 + SIDEWALK_W / 2;
  const gapHalf = ROAD_W / 2;
  const span: [number, number] = [-26, 26];

  const along = (z: number, gaps: number[]) => {
    let start = span[0];
    for (const g of [...gaps].sort((a, b) => a - b)) {
      if (g - gapHalf > start) strips.push({ x: (start + g - gapHalf) / 2, z, w: g - gapHalf - start, d: SIDEWALK_W });
      start = g + gapHalf;
    }
    strips.push({ x: (start + span[1]) / 2, z, w: span[1] - start, d: SIDEWALK_W });
  };

  for (let u = 0; u < units; u++) {
    const z0 = rowZ(u, 0);
    const z1 = rowZ(u, 1);
    along(z0 + edge, u > 0 ? [-CONNECTOR_X] : []);
    along(z0 - edge, [CONNECTOR_X]);
    along(z1 + edge, [CONNECTOR_X]);
    along(z1 - edge, u < units - 1 ? [-CONNECTOR_X] : []);
    const pieces: [number, number, number][] = [[CONNECTOR_X, z0 - ROAD_W / 2 - SIDEWALK_W, z1 + ROAD_W / 2 + SIDEWALK_W]];
    if (u < units - 1) pieces.push([-CONNECTOR_X, z1 - ROAD_W / 2 - SIDEWALK_W, rowZ(u + 1, 0) + ROAD_W / 2 + SIDEWALK_W]);
    for (const [x, za, zb] of pieces) {
      for (const side of [-1, 1]) strips.push({ x: x + side * edge, z: (za + zb) / 2, w: SIDEWALK_W, d: za - zb });
    }
  }
  return strips;
}
