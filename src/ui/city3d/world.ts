/**
 * Layout of the 3D city (pure data, no React, no three.js) so it can be tested.
 *
 * World units are metres. Y is up, the camera looks north (towards -z).
 * Each unit of the learning path is one district, DISTRICT_D metres deep.
 * The route snakes through each district exactly like the 2D map did:
 * in from the south on the west side, east along street 1, north on the
 * east side, west along street 2, and out to the north on the west side.
 */
import { createRng } from '@/domain/random';

export const HALF_W = 12;
export const ROAD_W = 5;
export const SIDEWALK_W = 1.4;
export const CONNECTOR_X = 9.2;
export const STOP_X = 4.2;
export const DISTRICT_D = 40;
const ROW_OFFSETS = [12, 28] as const;

export function districtStart(index: number): number {
  return -index * DISTRICT_D;
}

export function rowZ(index: number, row: 0 | 1): number {
  return districtStart(index) - ROW_OFFSETS[row];
}

export type Stop3D = { unit: number; index: number; row: 0 | 1; x: number; z: number; facing: 1 | -1 };

/** Lesson stops of one district, in route order. */
export function stops(unit: number): Stop3D[] {
  return [
    { unit, index: 0, row: 0, x: -STOP_X, z: rowZ(unit, 0), facing: 1 },
    { unit, index: 1, row: 0, x: STOP_X, z: rowZ(unit, 0), facing: 1 },
    { unit, index: 2, row: 1, x: STOP_X, z: rowZ(unit, 1), facing: -1 },
    { unit, index: 3, row: 1, x: -STOP_X, z: rowZ(unit, 1), facing: -1 },
  ];
}

/** Where the district's town sign stands. */
export function signPosition(unit: number): { x: number; z: number } {
  return { x: 5.5, z: districtStart(unit) - 2.2 };
}

export type Strip = { x: number; z: number; w: number; d: number };

/** Road pieces of a district: two east–west streets and the north–south connectors. */
export function roads(unit: number, units: number): { streets: Strip[]; connectors: Strip[] } {
  const z0 = rowZ(unit, 0);
  const z1 = rowZ(unit, 1);
  const streets = [z0, z1].map((z) => ({ x: 0, z, w: HALF_W * 2 + 20, d: ROAD_W }));
  const connectors: Strip[] = [{ x: CONNECTOR_X, z: (z0 + z1) / 2, w: ROAD_W, d: z0 - z1 }];
  if (unit < units - 1) {
    const zNext = rowZ(unit + 1, 0);
    connectors.push({ x: -CONNECTOR_X, z: (z1 + zNext) / 2, w: ROAD_W, d: z1 - zNext });
  }
  return { streets, connectors };
}

export type BuildingKind = 'house' | 'apartment' | 'shop' | 'tower';

export type Building3D = {
  kind: BuildingKind;
  x: number;
  /** z of the front facade (facing the street, towards the camera). */
  front: number;
  width: number;
  depth: number;
  height: number;
  facade: string;
  roof: string;
  accent: string;
  lit: number;
};

export type Tree3D = { x: number; z: number; scale: number; tone: number };

export const FACADES = ['#FFD36E', '#FF9E8A', '#7CC8FF', '#9BE07A', '#FFE9C7', '#C7A8FF', '#FFFFFF', '#FFB3D1', '#7FE0D2'];
const ROOFS = ['#FF6B4A', '#4FA3FF', '#FFB020', '#8A6CFF', '#2FBF8F', '#FF5A8A'];
const ACCENTS = ['#FF4D4F', '#2B70E4', '#2FBF5B', '#FFC400', '#FF8A00'];

/** Street fronts and trees of one district (deterministic per district). */
export function cityBlocks(unit: number, units: number): { buildings: Building3D[]; trees: Tree3D[] } {
  const rng = createRng(unit * 7919 + 17);
  const pick = <T,>(list: readonly T[]) => list[Math.floor(rng() * list.length)];
  const buildings: Building3D[] = [];
  const trees: Tree3D[] = [];
  const last = unit === units - 1;

  const blocks = [
    // North of street 1: the east connector runs here.
    { street: rowZ(unit, 0), from: -HALF_W, to: CONNECTOR_X - ROAD_W / 2 - SIDEWALK_W - 0.6 },
    // North of street 2: the west connector to the next district runs here.
    { street: rowZ(unit, 1), from: last ? -HALF_W : -CONNECTOR_X + ROAD_W / 2 + SIDEWALK_W + 0.6, to: HALF_W },
  ];

  for (const block of blocks) {
    const front = block.street - ROAD_W / 2 - SIDEWALK_W - 0.4;
    let x = block.from;
    while (x < block.to - 2) {
      const roll = rng();
      if (roll < 0.14) {
        trees.push({ x: x + 1.1, z: front - 1.2, scale: 0.9 + rng() * 0.4, tone: rng() });
        x += 2.4;
        continue;
      }
      const kind: BuildingKind = roll < 0.4 ? 'house' : roll < 0.62 ? 'apartment' : roll < 0.84 ? 'shop' : 'tower';
      const widths: Record<BuildingKind, [number, number]> = { house: [3.2, 4.4], apartment: [3.8, 5.4], shop: [3.4, 4.8], tower: [3, 3.8] };
      const heights: Record<BuildingKind, [number, number]> = { house: [3.2, 4.4], apartment: [5, 7.5], shop: [3, 4], tower: [8, 11] };
      const [wMin, wMax] = widths[kind];
      const [hMin, hMax] = heights[kind];
      const width = Math.min(wMin + rng() * (wMax - wMin), block.to - x);
      if (width < 2.6) break;
      buildings.push({
        kind,
        x: x + width / 2,
        front,
        width,
        depth: 3.4 + rng() * 1.6,
        height: hMin + rng() * (hMax - hMin),
        facade: pick(FACADES),
        roof: pick(ROOFS),
        accent: pick(ACCENTS),
        lit: Math.floor(rng() * 0xffff),
      });
      x += width + 0.35 + rng() * 0.6;
    }
    // Back gardens: a few trees behind the street front.
    for (let i = 0; i < 4; i++) {
      const tx = block.from + 1 + rng() * (block.to - block.from - 2);
      trees.push({ x: tx, z: front - 6.5 - rng() * 2.5, scale: 0.8 + rng() * 0.5, tone: rng() });
    }
  }

  // Park by the town sign, clear of the west connector.
  for (let i = 0; i < 3; i++) {
    trees.push({ x: -4 + i * 4.5 + rng(), z: districtStart(unit) - 1.5 - rng() * 2, scale: 0.8 + rng() * 0.4, tone: rng() });
  }
  return { buildings, trees };
}

/** Lane centre lines for traffic. Right-hand traffic: eastbound on the south lane. */
export function lanes(unit: number) {
  return {
    eastbound: [rowZ(unit, 0) + ROAD_W / 4, rowZ(unit, 1) + ROAD_W / 4],
    westbound: [rowZ(unit, 0) - ROAD_W / 4, rowZ(unit, 1) - ROAD_W / 4],
    northbound: { x: CONNECTOR_X + ROAD_W / 4, from: rowZ(unit, 0), to: rowZ(unit, 1) },
  };
}

/** Total depth of the city for `units` districts, plus a margin at both ends. */
export function cityDepth(units: number): { near: number; far: number } {
  return { near: 10, far: districtStart(units) - 6 };
}
