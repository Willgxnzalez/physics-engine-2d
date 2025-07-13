import { describe, it, expect } from 'vitest';
import { Vertices } from '../src/geometry/Vertices.js';
import { Vec2 } from '../src/geometry/Vec2.js';

describe('Vertices', () => {
  it('creates a vertex array', () => {
    const verts = [
      new Vec2(0, 0),
      new Vec2(1, 0),
      new Vec2(1, 1)
    ];

    const result = Vertices.create(verts);

    expect(result.length).toBe(3);
    expect(result[0].x).toBe(0);
    expect(result[1].x).toBe(1);
    expect(result[2].y).toBe(1);
  });

  it('translates vertices', () => {
    const verts = Vertices.create([
      new Vec2(0, 0),
      new Vec2(1, 0)
    ]);

    Vertices.translate(verts, new Vec2(5, 5));

    expect(verts[0].x).toBe(5);
    expect(verts[0].y).toBe(5);
    expect(verts[1].x).toBe(6);
    expect(verts[1].y).toBe(5);
  });

//   it('rotates vertices about a point', () => {
//     const verts = Vertices.create([
//       new Vec2(1, 0)
//     ]);

//     Vertices.rotateAbout(verts, Math.PI / 2, new Vec2(0, 0));

//     // After 90 degrees CCW rotation: (1,0) -> (0,1)
//     expect(Math.abs(verts[0].x)).toBeLessThan(1e-6);
//     expect(Math.abs(verts[0].y - 1)).toBeLessThan(1e-6);
//   });
});
