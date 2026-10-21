/**
 * Deterministic street-front generator: the same district always gets the same
 * buildings, so the city feels like a real place the learner comes back to.
 */
import { createRng } from '@/domain/random';

export type BuildingKind = 'house' | 'apartment' | 'shop' | 'tower' | 'tree';

export type Building = {
  kind: BuildingKind;
  x: number;
  width: number;
  height: number;
  facade: string;
  roof: string;
  /** Awning stripe colour for shops. */
  accent: string;
  /** Which windows are lit, as a bit pattern. */
  litMask: number;
};

export const FACADES = ['#F6D28B', '#F2B5A7', '#A9D1EE', '#BFE0A6', '#F3E6CF', '#CDBDEB', '#EEF2F5', '#F7C6D9'];
export const ROOFS = ['#B9553C', '#5B6670', '#8A4B3C', '#47515A'];
export const ACCENTS = ['#D3262E', '#1C5DB0', '#239B48', '#FFC20E'];

const MAX_H = 118;

export function streetFront(seed: number, from: number, to: number): Building[] {
  const rng = createRng(seed);
  const pick = <T,>(list: readonly T[]) => list[Math.floor(rng() * list.length)];
  const out: Building[] = [];
  let x = from;
  while (x < to - 30) {
    const roll = rng();
    const kind: BuildingKind =
      roll < 0.16 ? 'tree' : roll < 0.4 ? 'house' : roll < 0.62 ? 'apartment' : roll < 0.84 ? 'shop' : 'tower';
    const widths: Record<BuildingKind, [number, number]> = {
      tree: [26, 34],
      house: [52, 70],
      apartment: [60, 84],
      shop: [56, 76],
      tower: [40, 52],
    };
    const heights: Record<BuildingKind, [number, number]> = {
      tree: [44, 62],
      house: [64, 86],
      apartment: [84, 108],
      shop: [56, 74],
      tower: [104, MAX_H],
    };
    const [wMin, wMax] = widths[kind];
    const [hMin, hMax] = heights[kind];
    const width = Math.min(Math.round(wMin + rng() * (wMax - wMin)), to - x);
    if (width < 26) break;
    out.push({
      kind,
      x,
      width,
      height: Math.round(hMin + rng() * (hMax - hMin)),
      facade: pick(FACADES),
      roof: pick(ROOFS),
      accent: pick(ACCENTS),
      litMask: Math.floor(rng() * 0xffff),
    });
    x += width + 3 + Math.round(rng() * 6);
  }
  return out;
}
