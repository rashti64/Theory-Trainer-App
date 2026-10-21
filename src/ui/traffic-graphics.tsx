/**
 * Drawings for questions: German traffic signs and junctions seen from above.
 * Traffic signs are public official symbols; these are our own SVG drawings of them.
 */
import { View } from 'react-native';
import Svg, { Circle, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import type { Arm, Locale, SignSpec, Situation } from '@/domain/types';

import { fonts } from './theme';

const RED = '#D3262E';
const BLUE = '#1B5FB4';
const YELLOW = '#FFD200';
const INK = '#1B1B1B';

/** Sign drawn in a 120 × 120 box, as SVG elements (for nesting). */
export function SignShape({ spec }: { spec: SignSpec }) {
  switch (spec.code) {
    case '205':
      return (
        <G>
          <Polygon points="6,12 114,12 60,108" fill={RED} strokeLinejoin="round" stroke={RED} strokeWidth={6} />
          <Polygon points="28,25 92,25 60,84" fill="#FFFFFF" />
        </G>
      );
    case '206':
      return (
        <G>
          <Polygon points="35,4 85,4 116,35 116,85 85,116 35,116 4,85 4,35" fill="#FFFFFF" />
          <Polygon points="37,9 83,9 111,37 111,83 83,111 37,111 9,83 9,37" fill={RED} />
          <SvgText x={60} y={70} fontSize={30} fontFamily={fonts.black} fill="#FFFFFF" textAnchor="middle">
            STOP
          </SvgText>
        </G>
      );
    case '101':
    case '102':
    case '301':
      return (
        <G>
          <Polygon points="60,6 114,104 6,104" fill={RED} stroke={RED} strokeWidth={6} strokeLinejoin="round" />
          <Polygon points="60,28 96,93 24,93" fill="#FFFFFF" />
          {spec.code === '101' ? (
            <G>
              <Rect x={56} y={46} width={8} height={28} rx={3} fill={INK} />
              <Circle cx={60} cy={83} r={4.5} fill={INK} />
            </G>
          ) : spec.code === '102' ? (
            <G stroke={INK} strokeWidth={7} strokeLinecap="round">
              <Line x1={46} y1={52} x2={74} y2={84} />
              <Line x1={74} y1={52} x2={46} y2={84} />
            </G>
          ) : (
            <G>
              <Polygon points="60,44 70,58 64,58 64,88 56,88 56,58 50,58" fill={INK} />
              <Rect x={44} y={68} width={32} height={4} fill={INK} />
            </G>
          )}
        </G>
      );
    case '306':
    case '307':
      return (
        <G>
          <Polygon points="60,4 116,60 60,116 4,60" fill="#FFFFFF" stroke="#9AA3AC" strokeWidth={1.5} />
          <Polygon points="60,20 100,60 60,100 20,60" fill={YELLOW} />
          {spec.code === '307' ? (
            <G stroke="#3B3B3B" strokeWidth={3}>
              <Line x1={30} y1={42} x2={78} y2={90} />
              <Line x1={36} y1={36} x2={84} y2={84} />
              <Line x1={42} y1={30} x2={90} y2={78} />
            </G>
          ) : null}
        </G>
      );
    case '250':
    case '267':
    case '274':
      return (
        <G>
          <Circle cx={60} cy={60} r={56} fill={RED} />
          <Circle cx={60} cy={60} r={spec.code === '267' ? 56 : 43} fill={spec.code === '267' ? RED : '#FFFFFF'} />
          {spec.code === '267' ? <Rect x={24} y={52} width={72} height={16} fill="#FFFFFF" /> : null}
          {spec.code === '274' ? (
            <SvgText x={60} y={75} fontSize={42} fontFamily={fonts.black} fill={INK} textAnchor="middle">
              {String(spec.value ?? 50)}
            </SvgText>
          ) : null}
        </G>
      );
    case '283':
    case '286':
      return (
        <G>
          <Circle cx={60} cy={60} r={56} fill={RED} />
          <Circle cx={60} cy={60} r={44} fill={BLUE} />
          <G stroke={RED} strokeWidth={10}>
            <Line x1={29} y1={29} x2={91} y2={91} />
            {spec.code === '283' ? <Line x1={91} y1={29} x2={29} y2={91} /> : null}
          </G>
        </G>
      );
    case '201':
      return (
        <G>
          {[45, -45].map((deg) => (
            <G key={deg} transform={`rotate(${deg} 60 60)`}>
              <Rect x={2} y={50} width={116} height={20} fill="#FFFFFF" stroke={RED} strokeWidth={3} />
              <Rect x={4} y={52} width={22} height={16} fill={RED} />
              <Rect x={94} y={52} width={22} height={16} fill={RED} />
              <Rect x={49} y={52} width={22} height={16} fill={RED} />
            </G>
          ))}
        </G>
      );
    case '220':
      return (
        <G>
          <Rect x={2} y={36} width={116} height={48} rx={5} fill={BLUE} stroke="#FFFFFF" strokeWidth={3} />
          <Polygon points="18,55 78,55 78,46 102,60 78,74 78,65 18,65" fill="#FFFFFF" />
        </G>
      );
    case '274.1':
      return (
        <G>
          <Rect x={14} y={4} width={92} height={112} rx={6} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <Circle cx={60} cy={44} r={30} fill={RED} />
          <Circle cx={60} cy={44} r={22} fill="#FFFFFF" />
          <SvgText x={60} y={54} fontSize={26} fontFamily={fonts.black} fill={INK} textAnchor="middle">
            {String(spec.value ?? 30)}
          </SvgText>
          <SvgText x={60} y={102} fontSize={20} fontFamily={fonts.black} fill={INK} textAnchor="middle">
            ZONE
          </SvgText>
        </G>
      );
    case '237':
      return (
        <G>
          <Circle cx={60} cy={60} r={56} fill={BLUE} stroke="#FFFFFF" strokeWidth={3} />
          <Bicycle cx={60} cy={64} color="#FFFFFF" />
        </G>
      );
    case '314':
      return (
        <G>
          <Rect x={8} y={8} width={104} height={104} rx={8} fill={BLUE} stroke="#FFFFFF" strokeWidth={3} />
          <SvgText x={60} y={92} fontSize={84} fontFamily={fonts.black} fill="#FFFFFF" textAnchor="middle">
            P
          </SvgText>
        </G>
      );
    case '357':
      return (
        <G>
          <Rect x={8} y={8} width={104} height={104} rx={8} fill={BLUE} stroke="#FFFFFF" strokeWidth={3} />
          <Rect x={52} y={42} width={16} height={60} fill="#FFFFFF" />
          <Rect x={30} y={24} width={60} height={18} fill={RED} />
        </G>
      );
    case '215':
      return (
        <G>
          <Circle cx={60} cy={60} r={56} fill={BLUE} stroke="#FFFFFF" strokeWidth={3} />
          {[90, 210, 330].map((start) => (
            <RoundaboutArrow key={start} start={start} />
          ))}
        </G>
      );
    case '209':
      return (
        <G>
          <Circle cx={60} cy={60} r={56} fill={BLUE} stroke="#FFFFFF" strokeWidth={3} />
          <Path d="M 48 100 L 48 62 Q 48 46 64 46 L 74 46" stroke="#FFFFFF" strokeWidth={12} fill="none" />
          <Polygon points="72,30 96,46 72,62" fill="#FFFFFF" />
        </G>
      );
    case '131':
    case '138':
      return (
        <G>
          <Polygon points="60,6 114,104 6,104" fill={RED} stroke={RED} strokeWidth={6} strokeLinejoin="round" />
          <Polygon points="60,28 96,93 24,93" fill="#FFFFFF" />
          {spec.code === '131' ? (
            <G>
              <Rect x={51} y={46} width={18} height={42} rx={4} fill={INK} />
              <Circle cx={60} cy={54} r={4.5} fill="#E5484D" />
              <Circle cx={60} cy={67} r={4.5} fill="#FFC20E" />
              <Circle cx={60} cy={80} r={4.5} fill="#2FBF5B" />
            </G>
          ) : (
            <Bicycle cx={60} cy={76} color={INK} scale={0.55} />
          )}
        </G>
      );
    case '276':
      return (
        <G>
          <Circle cx={60} cy={60} r={56} fill={RED} />
          <Circle cx={60} cy={60} r={43} fill="#FFFFFF" />
          <RearCar x={33} color={RED} />
          <RearCar x={63} color={INK} />
        </G>
      );
    case '282':
      return (
        <G>
          <Circle cx={60} cy={60} r={56} fill="#FFFFFF" stroke="#7D868F" strokeWidth={2.5} />
          <G stroke={INK} strokeWidth={2.4}>
            {[-12, -6, 0, 6, 12].map((o) => (
              <Line key={o} x1={98 + o} y1={22 + o} x2={22 + o} y2={98 + o} />
            ))}
          </G>
        </G>
      );
    case '330.1':
      return (
        <G>
          <Rect x={8} y={8} width={104} height={104} rx={8} fill={BLUE} stroke="#FFFFFF" strokeWidth={3} />
          <Polygon points="22,104 48,46 54,46 42,104" fill="#FFFFFF" />
          <Polygon points="98,104 72,46 66,46 78,104" fill="#FFFFFF" />
          <Rect x={18} y={34} width={84} height={10} fill="#FFFFFF" />
          <Rect x={22} y={44} width={6} height={20} fill="#FFFFFF" />
          <Rect x={92} y={44} width={6} height={20} fill="#FFFFFF" />
        </G>
      );
    case '310':
    case '311':
      return (
        <G>
          <Rect x={2} y={28} width={116} height={64} rx={6} fill={YELLOW} stroke={INK} strokeWidth={4} />
          <SvgText x={60} y={66} fontSize={17} fontFamily={fonts.black} fill={INK} textAnchor="middle">
            {spec.place ?? 'Musterstadt'}
          </SvgText>
          {spec.code === '311' ? <Line x1={10} y1={86} x2={110} y2={34} stroke={RED} strokeWidth={7} /> : null}
        </G>
      );
  }
}

/** One of the three anticlockwise arrows of the roundabout sign (traffic drives anticlockwise). */
function RoundaboutArrow({ start }: { start: number }) {
  const r = 30;
  const end = start + 78;
  const pt = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return { x: 60 + r * Math.cos(a), y: 60 - r * Math.sin(a) };
  };
  const p0 = pt(start);
  const p1 = pt(end);
  const a = (end * Math.PI) / 180;
  // Direction of travel at the end of the arc (anticlockwise on screen).
  const dx = -Math.sin(a);
  const dy = -Math.cos(a);
  const tip = { x: p1.x + dx * 13, y: p1.y + dy * 13 };
  const b1 = { x: p1.x - dy * 10, y: p1.y + dx * 10 };
  const b2 = { x: p1.x + dy * 10, y: p1.y - dx * 10 };
  return (
    <G>
      <Path d={`M ${p0.x} ${p0.y} A ${r} ${r} 0 0 0 ${p1.x} ${p1.y}`} stroke="#FFFFFF" strokeWidth={9} fill="none" />
      <Polygon points={`${tip.x},${tip.y} ${b1.x},${b1.y} ${b2.x},${b2.y}`} fill="#FFFFFF" />
    </G>
  );
}

/** Simple bicycle seen from the side. */
function Bicycle({ cx, cy, color, scale = 1 }: { cx: number; cy: number; color: string; scale?: number }) {
  const s = scale;
  return (
    <G transform={`translate(${cx} ${cy}) scale(${s})`} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={-24} cy={10} r={16} />
      <Circle cx={24} cy={10} r={16} />
      <Path d="M -24 10 L -6 -16 L 16 -16 L 24 10 M -6 -16 L 2 10 L -24 10 M 2 10 L 16 -16 M -12 -24 L 0 -24 M 14 -24 L 22 -24 M 18 -24 L 16 -16" />
    </G>
  );
}

/** Car seen from behind, for the no-overtaking sign. */
function RearCar({ x, color }: { x: number; color: string }) {
  return (
    <G>
      <Path d={`M ${x + 4} 54 L ${x + 20} 54 L ${x + 23} 62 L ${x + 1} 62 Z`} fill={color} />
      <Rect x={x} y={61} width={24} height={14} rx={3} fill={color} />
      <Rect x={x + 1} y={74} width={6} height={7} rx={1.5} fill={color} />
      <Rect x={x + 17} y={74} width={6} height={7} rx={1.5} fill={color} />
    </G>
  );
}

export function SignGraphic({ spec, size = 132 }: { spec: SignSpec; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <SignShape spec={spec} />
    </Svg>
  );
}

// ── Junction diagrams ──────────────────────────────────────────────────────

const C = 150;
const ROAD = 64;
const LANE = 16;
const COLORS: Record<Situation['vehicles'][number]['color'], string> = {
  blue: '#2B70E4',
  red: '#F5484A',
  green: '#2FBF5B',
  yellow: '#FFC400',
  orange: '#FF8A00',
};

type V = { x: number; y: number };
const HEADING: Record<Arm, V> = { s: { x: 0, y: -1 }, n: { x: 0, y: 1 }, e: { x: -1, y: 0 }, w: { x: 1, y: 0 } };
const right = (h: V): V => ({ x: -h.y, y: h.x });
const left = (h: V): V => ({ x: h.y, y: -h.x });
const deg = (h: V) => (h.y === -1 ? 0 : h.x === 1 ? 90 : h.y === 1 ? 180 : 270);
const add = (a: V, b: V, k = 1): V => ({ x: a.x + b.x * k, y: a.y + b.y * k });

function Vehicle({ v, locale }: { v: Situation['vehicles'][number]; locale: Locale }) {
  const h = HEADING[v.arm];
  const isBike = v.kind === 'bike';
  const lane = isBike ? 27 : LANE;
  const dist = isBike ? 66 : v.kind === 'bus' ? 92 : 80;
  const pos = add(add({ x: C, y: C }, h, -dist), right(h), lane);
  const color = COLORS[v.color];

  // Intended path as an arrow.
  const nh = v.turn === 'straight' ? h : v.turn === 'left' ? left(h) : right(h);
  const start = add(pos, h, isBike ? 16 : 24);
  const exit = add(add({ x: C, y: C }, nh, 100), right(nh), lane);
  const control = v.turn === 'straight' ? { x: (start.x + exit.x) / 2, y: (start.y + exit.y) / 2 } : h.x === 0 ? { x: start.x, y: exit.y } : { x: exit.x, y: start.y };
  const tip = add(exit, nh, 10);
  const wing = right(nh);
  const arrowHead = `${tip.x},${tip.y} ${exit.x + wing.x * 7},${exit.y + wing.y * 7} ${exit.x - wing.x * 7},${exit.y - wing.y * 7}`;

  return (
    <G>
      <Path d={`M${start.x} ${start.y} Q${control.x} ${control.y} ${exit.x} ${exit.y}`} stroke={color} strokeWidth={4} fill="none" strokeDasharray="7 5" strokeLinecap="round" />
      <Polygon points={arrowHead} fill={color} />
      <G transform={`translate(${pos.x} ${pos.y}) rotate(${deg(h)})`}>
        {isBike ? (
          <G>
            <Rect x={-3} y={-14} width={6} height={28} rx={3} fill="#2A3036" />
            <Circle cx={0} cy={0} r={6} fill={color} />
          </G>
        ) : v.kind === 'bus' ? (
          <G>
            <Rect x={-14} y={-32} width={28} height={64} rx={5} fill={color} />
            <Rect x={-11} y={-28} width={22} height={8} rx={2} fill="#CFE6F7" />
          </G>
        ) : (
          <G>
            <Rect x={-13} y={-22} width={26} height={44} rx={8} fill={color} stroke="#FFFFFF" strokeWidth={v.me ? 3 : 0} />
            <Rect x={-10} y={-14} width={20} height={10} rx={3} fill="#CFE6F7" />
            <Rect x={-10} y={8} width={20} height={7} rx={2} fill="#CFE6F7" opacity={0.8} />
          </G>
        )}
      </G>
      {v.me ? (
        <G>
          <Rect x={pos.x + 18} y={pos.y + 4} width={44} height={22} rx={11} fill="#FFFFFF" stroke={color} strokeWidth={2.5} />
          <SvgText x={pos.x + 40} y={pos.y + 20} fontSize={13} fontFamily={fonts.black} fill={color} textAnchor="middle">
            {locale === 'de' ? 'Sie' : 'You'}
          </SvgText>
        </G>
      ) : null}
    </G>
  );
}

function Crossing({ arm }: { arm: Arm }) {
  const h = HEADING[arm];
  const center = add({ x: C, y: C }, h, -62);
  const stripes = [-24, -12, 0, 12, 24];
  const across = right(h);
  const person = add(center, across, 8);
  return (
    <G>
      {stripes.map((o) => {
        const p = add(center, across, o);
        return h.x === 0 ? (
          <Rect key={o} x={p.x - 3} y={p.y - 10} width={6} height={20} fill="#FFFFFF" />
        ) : (
          <Rect key={o} x={p.x - 10} y={p.y - 3} width={20} height={6} fill="#FFFFFF" />
        );
      })}
      <Circle cx={person.x} cy={person.y} r={9} fill="#8B5CF6" stroke="#FFFFFF" strokeWidth={2} />
      <Circle cx={person.x} cy={person.y} r={4} fill="#F2C8A0" />
    </G>
  );
}

export function SituationDiagram({ situation, locale, size = 300 }: { situation: Situation; locale: Locale; size?: number }) {
  const t = situation.kind === 't-junction';
  const arms: Arm[] = t ? ['e', 'w', 's'] : ['n', 'e', 's', 'w'];
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 300 300">
        <Rect x={0} y={0} width={300} height={300} rx={18} fill="#9FDB7C" />
        {/* roads */}
        <Rect x={0} y={C - ROAD / 2} width={300} height={ROAD} fill="#5B6570" />
        <Rect x={C - ROAD / 2} y={t ? C - ROAD / 2 : 0} width={ROAD} height={t ? 300 - (C - ROAD / 2) : 300} fill="#5B6570" />
        {/* centre lines */}
        <G stroke="#FFFFFF" strokeWidth={2.5} strokeDasharray="10 8" opacity={0.85}>
          <Line x1={0} y1={C} x2={C - ROAD / 2 - 4} y2={C} />
          <Line x1={C + ROAD / 2 + 4} y1={C} x2={300} y2={C} />
          <Line x1={C} y1={C + ROAD / 2 + 4} x2={C} y2={300} />
          {!t ? <Line x1={C} y1={0} x2={C} y2={C - ROAD / 2 - 4} /> : null}
        </G>
        {(situation.pedestrians ?? []).map((arm) => (
          <Crossing key={arm} arm={arm} />
        ))}
        {/* signs on the right of each approach */}
        {arms.map((arm) => {
          const sign = situation.signs?.[arm];
          if (!sign) return null;
          const h = HEADING[arm];
          const p = add(add({ x: C, y: C }, h, -60), right(h), 52);
          const code = sign === 'priority' ? '306' : sign === 'give-way' ? '205' : '206';
          return (
            <G key={arm} transform={`translate(${p.x - 14} ${p.y - 14}) scale(0.24)`}>
              <SignShape spec={{ code }} />
            </G>
          );
        })}
        {situation.vehicles.map((v, i) => (
          <Vehicle key={i} v={v} locale={locale} />
        ))}
      </Svg>
    </View>
  );
}
