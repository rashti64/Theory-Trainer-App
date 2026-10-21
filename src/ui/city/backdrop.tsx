/**
 * The static part of a district: grass, roads, sidewalks, crossings and the
 * street fronts. Everything that moves is drawn on top (see district.tsx).
 */
import { memo } from 'react';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

import { streetFront, type Building } from './buildings';
import {
  blockRange,
  connectors,
  ROAD_H,
  ROWS_PER_UNIT,
  SIDEWALK_H,
  SIGN_H,
  STREET_H,
  streetY,
  UNIT_H,
} from './geometry';

const GRASS = '#CBE9AE';
const GRASS_DARK = '#B4DD93';
const ASPHALT = '#5B6570';
const SIDEWALK = '#DCE1E6';
const CURB = '#C2C9D0';

export const Backdrop = memo(function Backdrop({
  width,
  seed,
  first,
  last,
  dim,
}: {
  width: number;
  seed: number;
  first: boolean;
  last: boolean;
  /** Locked districts are drawn a little faded. */
  dim: boolean;
}) {
  const roads = connectors(width, { first, last });
  const rows = Array.from({ length: ROWS_PER_UNIT }, (_, r) => r);

  return (
    <Svg width={width} height={UNIT_H} style={{ position: 'absolute', top: 0, left: 0 }}>
      <Rect x={0} y={0} width={width} height={UNIT_H} fill={GRASS} />
      <GrassDetails width={width} seed={seed} />

      {/* Vertical connector roads, with sidewalks. */}
      {roads.map((s, i) => (
        <G key={`c${i}`}>
          <Rect x={s.x - SIDEWALK_H} y={s.y} width={s.w + SIDEWALK_H * 2} height={s.h} fill={SIDEWALK} />
          <Rect x={s.x} y={s.y} width={s.w} height={s.h} fill={ASPHALT} />
          <Line
            x1={s.x + s.w / 2}
            y1={s.y}
            x2={s.x + s.w / 2}
            y2={s.y + s.h}
            stroke="#FFFFFF"
            strokeWidth={3}
            strokeDasharray="12 12"
            opacity={0.85}
          />
        </G>
      ))}

      {rows.map((r) => {
        const y = streetY(r);
        const range = blockRange(r, width, first);
        const front = streetFront(seed * 10 + r, range.from, range.to);
        return (
          <G key={`r${r}`}>
            {/* Street: sidewalks, curb lines, road, centre line. */}
            <Rect x={0} y={y - STREET_H / 2} width={width} height={STREET_H} fill={SIDEWALK} />
            <Line x1={0} y1={y - ROAD_H / 2} x2={width} y2={y - ROAD_H / 2} stroke={CURB} strokeWidth={2} />
            <Line x1={0} y1={y + ROAD_H / 2} x2={width} y2={y + ROAD_H / 2} stroke={CURB} strokeWidth={2} />
            <Rect x={0} y={y - ROAD_H / 2} width={width} height={ROAD_H} fill={ASPHALT} />
            <Line
              x1={0}
              y1={y}
              x2={width}
              y2={y}
              stroke="#FFFFFF"
              strokeWidth={3}
              strokeDasharray="14 12"
              opacity={0.85}
            />
            {/* Zebra crossing in the middle of the street. */}
            <G>
              {Array.from({ length: 6 }, (_, i) => (
                <Rect
                  key={i}
                  x={width / 2 - 14}
                  y={y - ROAD_H / 2 + 3 + i * 8}
                  width={28}
                  height={4.5}
                  fill="#FFFFFF"
                  opacity={0.92}
                />
              ))}
            </G>
            {/* Street front, standing on the upper sidewalk. */}
            {front.map((b, i) => (
              <BuildingShape key={i} b={b} base={y - STREET_H / 2 + 3} />
            ))}
          </G>
        );
      })}

      {dim ? <Rect x={0} y={SIGN_H - 10} width={width} height={UNIT_H} fill="#F3F5F7" opacity={0.45} /> : null}
    </Svg>
  );
});

function GrassDetails({ width, seed }: { width: number; seed: number }) {
  // A few flowers and bushes in the sign area so the edge of town feels alive.
  const spots = [0.18, 0.52, 0.86].map((f, i) => ({ x: width * f + ((seed * 37 + i * 53) % 30) - 15, y: 30 + ((seed * 13 + i * 29) % 50) }));
  return (
    <G>
      {spots.map((s, i) => (
        <G key={i}>
          <Circle cx={s.x} cy={s.y} r={10} fill={GRASS_DARK} />
          <Circle cx={s.x + 10} cy={s.y + 4} r={7} fill={GRASS_DARK} />
          <Circle cx={s.x - 6} cy={s.y + 14} r={2.4} fill="#FFFFFF" />
          <Circle cx={s.x + 16} cy={s.y + 16} r={2.4} fill="#F7C6D9" />
          <Circle cx={s.x + 3} cy={s.y + 20} r={2.4} fill="#FFE27A" />
        </G>
      ))}
    </G>
  );
}

function BuildingShape({ b, base }: { b: Building; base: number }) {
  const top = base - b.height;
  if (b.kind === 'tree') {
    const cx = b.x + b.width / 2;
    return (
      <G>
        <Rect x={cx - 2.5} y={base - 16} width={5} height={16} rx={2} fill="#8A5A3B" />
        <Circle cx={cx} cy={top + 16} r={b.width / 2} fill="#4FA45B" />
        <Circle cx={cx - 7} cy={top + 24} r={b.width / 2.8} fill="#62B86C" />
        <Circle cx={cx + 6} cy={top + 10} r={b.width / 3.4} fill="#6CC377" />
      </G>
    );
  }

  const roofH = b.kind === 'house' ? 22 : 0;
  const bodyTop = top + roofH;
  const bodyH = b.height - roofH;
  const cols = Math.max(2, Math.floor((b.width - 10) / 16));
  const shopFloor = b.kind === 'shop' ? 30 : 0;
  const rows = Math.max(1, Math.floor((bodyH - 14 - shopFloor - 16) / 19));
  const colGap = (b.width - cols * 10) / (cols + 1);

  const windows = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = (b.litMask >> ((r * cols + c) % 16)) & 1;
      windows.push(
        <Rect
          key={`${r}-${c}`}
          x={b.x + colGap + c * (10 + colGap)}
          y={bodyTop + 10 + r * 19}
          width={10}
          height={12}
          rx={2}
          fill={lit ? '#FFE69A' : '#9CC3E0'}
        />,
      );
    }
  }

  return (
    <G>
      {/* soft shadow on the sidewalk */}
      <Rect x={b.x + 2} y={base - 2} width={b.width} height={5} rx={2} fill="rgba(0,0,0,0.08)" />
      <Rect x={b.x} y={bodyTop} width={b.width} height={bodyH} rx={3} fill={b.facade} />
      {b.kind === 'house' ? (
        <Path d={`M${b.x - 4} ${bodyTop + 2} L${b.x + b.width / 2} ${top} L${b.x + b.width + 4} ${bodyTop + 2} Z`} fill={b.roof} />
      ) : (
        <Rect x={b.x - 2} y={bodyTop - 5} width={b.width + 4} height={7} rx={2} fill={b.roof} />
      )}
      {b.kind === 'tower' ? <Line x1={b.x + b.width / 2} y1={bodyTop - 5} x2={b.x + b.width / 2} y2={bodyTop - 20} stroke={b.roof} strokeWidth={2} /> : null}
      {windows}
      {b.kind === 'shop' ? (
        <G>
          <Rect x={b.x + 5} y={base - 22} width={b.width - 22} height={20} rx={2} fill="#CFE6F7" />
          <Rect x={b.x + b.width - 14} y={base - 20} width={10} height={20} rx={2} fill="#7A5338" />
          {/* striped awning */}
          {Array.from({ length: Math.ceil((b.width + 4) / 8) }, (_, i) => (
            <Rect
              key={i}
              x={b.x - 2 + i * 8}
              y={base - 31}
              width={Math.min(8, b.width + 4 - i * 8)}
              height={8}
              fill={i % 2 === 0 ? b.accent : '#FFFFFF'}
            />
          ))}
        </G>
      ) : (
        <Rect x={b.x + b.width / 2 - 6} y={base - 18} width={12} height={18} rx={2} fill="#7A5338" />
      )}
    </G>
  );
}
