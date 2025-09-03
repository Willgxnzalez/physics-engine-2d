import { describe, it, expect } from 'vitest';
import { Vec2 } from '../src/geometry/Vec2.js';

describe('Vec2', () => {
  it('constructs with default values', () => {
    const v = new Vec2();
    expect(v.x).toBe(0);
    expect(v.y).toBe(0);
  });

  it('constructs with given values', () => {
    const v = new Vec2(3, 4);
    expect(v.x).toBe(3);
    expect(v.y).toBe(4);
  });

  it('adds two vectors (immutable)', () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, 4);
    const result = v1.add(v2);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
    // v1 and v2 should not be mutated
    expect(v1.x).toBe(1);
    expect(v1.y).toBe(2);
    expect(v2.x).toBe(3);
    expect(v2.y).toBe(4);
  });

  it('adds two vectors in place', () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, 4);
    v1.addEq(v2);
    expect(v1.x).toBe(4);
    expect(v1.y).toBe(6);
    expect(v2.x).toBe(3);
    expect(v2.y).toBe(4);
  });

  it('subtracts two vectors (immutable)', () => {
    const v1 = new Vec2(5, 7);
    const v2 = new Vec2(2, 3);
    const result = v1.sub(v2);
    expect(result.x).toBe(3);
    expect(result.y).toBe(4);
    expect(v1.x).toBe(5);
    expect(v1.y).toBe(7);
  });

  it('subtracts two vectors in place', () => {
    const v1 = new Vec2(5, 7);
    const v2 = new Vec2(2, 3);
    v1.subEq(v2);
    expect(v1.x).toBe(3);
    expect(v1.y).toBe(4);
  });

  it('throws on division by zero', () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(0, 1);
    expect(() => v1.div(v2)).toThrow();
  });

  it('calculates dot product', () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, 4);
    expect(v1.dot(v2)).toBe(11);
  });

  it('calculates cross product (scalar)', () => {
    const v1 = new Vec2(2, 3);
    const v2 = new Vec2(4, 5);
    expect(v1.cross(v2)).toBe(-2);
  });

  it('calculates magnitude', () => {
    const v = new Vec2(3, 4);
    expect(v.mag()).toBe(5);
  });

  it('calculates squared magnitude', () => {
    const v = new Vec2(3, 4);
    expect(v.magSq()).toBe(25);
  });

  it('normalizes a vector (immutable)', () => {
    const v = new Vec2(3, 4);
    const n = v.normalized();
    expect(n.x).toBeCloseTo(0.6);
    expect(n.y).toBeCloseTo(0.8);
    // v should not be mutated
    expect(v.x).toBe(3);
    expect(v.y).toBe(4);
  });

  it('normalizes a vector in place', () => {
    const v = new Vec2(3, 4);
    v.normalize();
    expect(v.x).toBeCloseTo(0.6);
    expect(v.y).toBeCloseTo(0.8);
  });

  it('handles normalizing zero vector', () => {
    const v = new Vec2(0, 0);
    v.normalize();
    expect(v.x).toBe(0);
    expect(v.y).toBe(0);
    const nv = v.normalized();
    expect(nv.x).toBe(0);
    expect(nv.y).toBe(0);
  });

  it('scales a vector (immutable)', () => {
    const v = new Vec2(2, 3);
    const s = v.scale(5);
    expect(s.x).toBe(10);
    expect(s.y).toBe(15);
    expect(v.x).toBe(2);
    expect(v.y).toBe(3);
  });

  it('scales a vector in place', () => {
    const v = new Vec2(2, 3);
    v.scaleEq(5);
    expect(v.x).toBe(10);
    expect(v.y).toBe(15);
  });

  it('translates a vector in place', () => {
    const v = new Vec2(1, 2);
    v.translateEq(new Vec2(3, 4));
    expect(v.x).toBe(4);
    expect(v.y).toBe(6);
  });


  it('negates a vector (immutable)', () => {
    const v = new Vec2(5, -7);
    const n = v.negate();
    expect(n.x).toBe(-5);
    expect(n.y).toBe(7);
    expect(v.x).toBe(5);
    expect(v.y).toBe(-7);
  });

  it('returns a perpendicular vector (immutable)', () => {
    const v = new Vec2(2, 3);
    const p = v.perp();
    expect(p.x).toBe(-3);
    expect(p.y).toBe(2);
    expect(v.x).toBe(2);
    expect(v.y).toBe(3);
  });

  it('clones a vector', () => {
    const v = new Vec2(7, 8);
    const c = v.clone();
    expect(c.x).toBe(7);
    expect(c.y).toBe(8);
    expect(c).not.toBe(v);
  });
});