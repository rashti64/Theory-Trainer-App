/**
 * Layout of the city map. Each unit of the learning path is one district:
 * a town-entry sign at the top, then two streets with two lesson stops each.
 *
 * The route snakes through the city: every district enters at the top left,
 * runs left→right along street 1, turns down on the right, runs right→left
 * along street 2, and leaves at the bottom left into the next district.
 *
 * Pure math, no React, so it can be unit-tested.
 */
export const SIGN_H = 104;
export const BLOCK_H = 132;
export const SIDEWALK_H = 14;
export const ROAD_H = 52;
export const STREET_H = ROAD_H + SIDEWALK_H * 2;
export const ROW_H = BLOCK_H + STREET_H;
export const ROWS_PER_UNIT = 2;
export const STOPS_PER_ROW = 2;
export const BOTTOM_PAD = 28;
export const UNIT_H = SIGN_H + ROWS_PER_UNIT * ROW_H + BOTTOM_PAD;

/** Centre line of the vertical connector roads, measured from the screen edge. */
export const CONNECTOR_INSET = 40;
export const CONNECTOR_W = ROAD_H;

/** Where the stops sit along a street, as a share of the width, in travel order. */
const STOP_FRACTIONS = [0.33, 0.69] as const;

export function streetY(row: number): number {
  return SIGN_H + BLOCK_H + row * ROW_H + STREET_H / 2;
}

export type Stop = { index: number; row: number; x: number; y: number };

/** The lesson stops of one district, in the order the learner meets them. */
export function districtStops(width: number): Stop[] {
  const stops: Stop[] = [];
  for (let row = 0; row < ROWS_PER_UNIT; row++) {
    const leftToRight = row % 2 === 0;
    STOP_FRACTIONS.forEach((f, j) => {
      const share = leftToRight ? f : 1 - f;
      stops.push({ index: row * STOPS_PER_ROW + j, row, x: Math.round(width * share), y: streetY(row) });
    });
  }
  return stops;
}

export type Segment = { x: number; y: number; w: number; h: number };

/** Vertical road pieces of a district (left in, right between streets, left out). */
export function connectors(width: number, opts: { first: boolean; last: boolean }): Segment[] {
  const half = CONNECTOR_W / 2;
  const leftX = CONNECTOR_INSET - half;
  const rightX = width - CONNECTOR_INSET - half;
  const pieces: Segment[] = [];
  if (!opts.first) pieces.push({ x: leftX, y: 0, w: CONNECTOR_W, h: streetY(0) });
  pieces.push({ x: rightX, y: streetY(0), w: CONNECTOR_W, h: streetY(1) - streetY(0) });
  if (!opts.last) pieces.push({ x: leftX, y: streetY(1), w: CONNECTOR_W, h: UNIT_H - streetY(1) });
  return pieces;
}

/** Horizontal range free for buildings in the block above a street (connectors stay clear). */
export function blockRange(row: number, width: number, first: boolean): { from: number; to: number } {
  const clear = CONNECTOR_INSET + CONNECTOR_W / 2 + 12;
  if (row === 0) return { from: first ? 12 : clear, to: width - 12 };
  return { from: 12, to: width - clear };
}
