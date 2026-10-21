import { LESSONS_PER_UNIT } from '@/content/path-progress';
import { moodForHour } from '@/ui/city3d/time-of-day';
import { CONNECTOR_X, cityBlocks, HALF_W, roads, rowZ, ROAD_W, stops } from '@/ui/city3d/world';
import { applyKey, parseNumberInput } from '@/ui/number-input';

describe('3D city layout', () => {
  it('has one stop per lesson, along the route', () => {
    const s = stops(0);
    expect(s).toHaveLength(LESSONS_PER_UNIT);
    // Street 1 runs west→east, street 2 east→west, further away.
    expect(s[0].x).toBeLessThan(s[1].x);
    expect(s[2].x).toBeGreaterThan(s[3].x);
    expect(s[2].z).toBeLessThan(s[1].z);
  });

  it('places each district further along than the last', () => {
    expect(rowZ(1, 0)).toBeLessThan(rowZ(0, 1));
  });

  it('links the last street of a district to the next district', () => {
    expect(roads(0, 3).connectors).toHaveLength(2);
    expect(roads(2, 3).connectors).toHaveLength(1);
  });

  it('keeps buildings off the roads and inside the city', () => {
    for (let u = 0; u < 7; u++) {
      for (const b of cityBlocks(u, 7).buildings) {
        expect(b.x - b.width / 2).toBeGreaterThanOrEqual(-HALF_W - 0.01);
        expect(b.x + b.width / 2).toBeLessThanOrEqual(HALF_W + 0.01);
        const onConnector = (cx: number) => b.x + b.width / 2 > cx - ROAD_W / 2 && b.x - b.width / 2 < cx + ROAD_W / 2;
        const block = b.front > rowZ(u, 1) ? 0 : 1;
        if (block === 0) expect(onConnector(CONNECTOR_X)).toBe(false);
        if (block === 1 && u < 6) expect(onConnector(-CONNECTOR_X)).toBe(false);
      }
    }
  });

  it('builds the same district every time', () => {
    expect(cityBlocks(3, 7)).toEqual(cityBlocks(3, 7));
  });

  it('follows the clock: morning, day, golden hour, night', () => {
    expect(moodForHour(8)).toBe('morning');
    expect(moodForHour(13)).toBe('day');
    expect(moodForHour(18)).toBe('golden');
    expect(moodForHour(23)).toBe('night');
    expect(moodForHour(3)).toBe('night');
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
