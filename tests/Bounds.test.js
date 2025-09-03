import { describe, it, expect } from 'vitest';
import { Bounds } from '../src/geometry/Bounds.js';
import { Vec2 } from '../src/geometry/Vec2.js';

describe('Bounds', () => {
  it('creates correct bounds from vertices using updateFromVertices', () => {
    const verts = [
      new Vec2(0, 0),
      new Vec2(10, 0),
      new Vec2(10, 20),
      new Vec2(0, 20)
    ];

    const bounds = new Bounds();
    bounds.updateFromVertices(verts);

    expect(bounds.minX).toBe(0);
    expect(bounds.minY).toBe(0);
    expect(bounds.maxX).toBe(10);
    expect(bounds.maxY).toBe(20);
  });

  it('checks for point containment', () => {
    // Bounds(minX, minY, maxX, maxY)
    const bounds = new Bounds(0, 0, 10, 10);
    expect(bounds.contains(new Vec2(5, 5))).toBe(true);
    expect(bounds.contains(new Vec2(15, 5))).toBe(false);
  });

  it('checks for overlap', () => {
    const a = new Bounds(0, 0, 10, 10);
    const b = new Bounds(5, 5, 15, 15);
    const c = new Bounds(20, 20, 30, 30);

    expect(a.overlaps(b)).toBe(true);
    expect(a.overlaps(c)).toBe(false);
  });

  // The Bounds class in the new code does not have a translate method or min/max Vec2 properties.
  // So we remove the translate test or adapt it if needed in the future.
});