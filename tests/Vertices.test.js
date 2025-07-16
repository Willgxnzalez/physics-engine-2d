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

  it('translates vertices', () => {
    const verts = new Vertices([
      { x: 0, y: 0 },
      { x: 1, y: 0 }
    ]);

    const translated = verts.translate({ x: 5, y: 5 });

    expect(translated.at(0).x).toBe(5);
    expect(translated.at(0).y).toBe(5);
    expect(translated.at(1).x).toBe(6);
    expect(translated.at(1).y).toBe(5);
  });

  it('rotates vertices about a point', () => {
    const verts = new Vertices([
      { x: 1, y: 0 },
      { x: 0, y: 1 }
    ]);

    const rotated = verts.rotate(Math.PI / 2);

    expect(Math.abs(rotated.at(0).x)).toBeLessThan(1e-6);
    expect(Math.abs(rotated.at(0).y - 1)).toBeLessThan(1e-6);
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

  it('computes area of different shapes', () => {
    const triangle = new Vertices([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 }
    ]);

    const square = new Vertices([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 }
    ]);

    expect(triangle.area()).toBeCloseTo(0.5);
    expect(square.area()).toBeCloseTo(1);
  });

  it('computes centroid of a triangle', () => {
    const triangle = new Vertices([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 }
    ]);

    const centroid = triangle.centroid();
    expect(centroid.x).toBeCloseTo(1 / 3);
    expect(centroid.y).toBeCloseTo(1 / 3);
  });
});
