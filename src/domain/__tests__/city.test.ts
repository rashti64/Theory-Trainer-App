import { LESSONS_PER_UNIT } from '@/content/path-progress';
import { streetFront } from '@/ui/city/buildings';
import { connectors, districtStops, streetY, UNIT_H } from '@/ui/city/geometry';
import { applyKey, parseNumberInput } from '@/ui/number-input';

describe('city map geometry', () => {
  const width = 390;

  it('has one stop per lesson, in route order', () => {
    const stops = districtStops(width);
    expect(stops).toHaveLength(LESSONS_PER_UNIT);
    // Street 1 runs left to right, street 2 right to left.
    expect(stops[0].x).toBeLessThan(stops[1].x);
    expect(stops[2].x).toBeGreaterThan(stops[3].x);
    expect(stops.map((s) => s.index)).toEqual([0, 1, 2, 3]);
  });

  it('keeps every stop inside the district', () => {
    for (const s of districtStops(width)) {
      expect(s.x).toBeGreaterThan(40);
      expect(s.x).toBeLessThan(width - 40);
      expect(s.y).toBeLessThan(UNIT_H);
    }
  });

  it('connects districts on the left and streets on the right', () => {
    const middle = connectors(width, { first: false, last: false });
    expect(middle).toHaveLength(3);
    expect(middle[1].x).toBeGreaterThan(width / 2);
    expect(middle[1].y).toBe(streetY(0));
    expect(connectors(width, { first: true, last: true })).toHaveLength(1);
  });

  it('builds the same street every time and stays in its lot', () => {
    expect(streetFront(5, 12, 378)).toEqual(streetFront(5, 12, 378));
    for (const b of streetFront(9, 80, 378)) {
      expect(b.x).toBeGreaterThanOrEqual(80);
      expect(b.x + b.width).toBeLessThanOrEqual(378);
    }
  });
});

describe('number pad', () => {
  it('types digits and a single decimal comma', () => {
    let text = '';
    for (const key of ['1', ',', '6', ','] as const) text = applyKey(text, key);
    expect(text).toBe('1,6');
  });

  it('does not start with a comma or a leading zero', () => {
    expect(applyKey('', ',')).toBe('');
    expect(applyKey('0', '5')).toBe('5');
  });

  it('reads German decimal commas', () => {
    expect(parseNumberInput('1,6')).toBe(1.6);
    expect(parseNumberInput('')).toBeNull();
  });

  it('deletes the last character', () => {
    expect(applyKey('130', 'del')).toBe('13');
  });
});
