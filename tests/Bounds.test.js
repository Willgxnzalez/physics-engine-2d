import { describe, it, expect } from 'vitest';
import { Bounds } from '../src/geometry/Bounds.js';
import { Vec2 } from '../src/geometry/Vec2.js';

describe('Bounds', () => {
  it('creates correct bounds from vertices', () => {
    const verts = [
      new Vec2(0, 0),
      new Vec2(10, 0),
      new Vec2(10, 20),
      new Vec2(0, 20)
    ];

    const bounds = Bounds.fromVertices(verts);

    expect(bounds.min.x).toBe(0);
    expect(bounds.min.y).toBe(0);
    expect(bounds.max.x).toBe(10);
    expect(bounds.max.y).toBe(20);
  });

  it('checks for point containment', () => {
    const bounds = new Bounds(new Vec2(0, 0), new Vec2(10, 10));
    expect(bounds.contains(new Vec2(5, 5))).toBe(true);
    expect(bounds.contains(new Vec2(15, 5))).toBe(false);
  });

  it('checks for overlap', () => {
    const a = new Bounds(new Vec2(0, 0), new Vec2(10, 10));
    const b = new Bounds(new Vec2(5, 5), new Vec2(15, 15));
    const c = new Bounds(new Vec2(20, 20), new Vec2(30, 30));

    expect(a.overlaps(b)).toBe(true);
    expect(a.overlaps(c)).toBe(false);
  });

  it('translates bounds correctly', () => {
    const bounds = new Bounds(new Vec2(0, 0), new Vec2(10, 10));
    const offset = new Vec2(5, 5);
    
    bounds.translate(offset);

    expect(bounds.min.x).toBe(5);
    expect(bounds.min.y).toBe(5);
    expect(bounds.max.x).toBe(15);
    expect(bounds.max.y).toBe(15);
  });
});