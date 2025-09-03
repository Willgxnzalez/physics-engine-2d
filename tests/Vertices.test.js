import { describe, it, expect } from 'vitest';
import { Vertices } from '../src/geometry/Vertices.js';

describe('Vertices', () => {
  it('creates a vertex array', () => {
    const verts = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 }
    ];

    const result = new Vertices(verts);

    expect(result.length).toBe(3);
    expect(result.at(0).x).toBe(0);
    expect(result.at(1).x).toBe(1);
    expect(result.at(2).y).toBe(1);
  });

  it('iterates over vertices', () => {
    const verts = new Vertices([
      { x: 0, y: 0 },
      { x: 1, y: 1 }
    ]);

    const points = [];
    for (const point of verts) {
      points.push(point);
    }

    expect(points.length).toBe(2);
    expect(points[0].x).toBe(0);
    expect(points[1].y).toBe(1);
  });

  it('rotates vertices in place', () => {
    const verts = new Vertices([
      { x: 1, y: 0 },
      { x: 0, y: 1 }
    ]);
    verts.rotateInPlace(Math.PI / 2); // 90 degrees

    // After 90deg rotation: (1,0) -> (0,1), (0,1) -> (-1,0)
    expect(Math.abs(verts.at(0).x)).toBeLessThan(1e-10);
    expect(Math.abs(verts.at(0).y - 1)).toBeLessThan(1e-10);
    expect(Math.abs(verts.at(1).x + 1)).toBeLessThan(1e-10);
    expect(Math.abs(verts.at(1).y)).toBeLessThan(1e-10);
  });

  it('translates vertices in place', () => {
    const verts = new Vertices([
      { x: 1, y: 2 },
      { x: -1, y: -2 }
    ]);
    verts.translateInPlace({ x: 3, y: 4 });

    expect(verts.at(0).x).toBe(4);
    expect(verts.at(0).y).toBe(6);
    expect(verts.at(1).x).toBe(2);
    expect(verts.at(1).y).toBe(2);
  });
});
