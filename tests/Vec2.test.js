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

  it('adds two vectors', () => {
    const v1 = new Vec2(1, 2);
    const v2 = new Vec2(3, 4);
    const result = v1.add(v2);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  it('subtracts two vectors', () => {
    const v1 = new Vec2(5, 7);
    const v2 = new Vec2(2, 3);
    const result = v1.sub(v2);
    expect(result.x).toBe(3);
    expect(result.y).toBe(4);
  });

  it('multiplies two vectors', () => {
    const v1 = new Vec2(2, 3);
    const v2 = new Vec2(4, 5);
    const result = v1.mult(v2);
    expect(result.x).toBe(8);
    expect(result.y).toBe(15);
  });

  it('divides two vectors', () => {
    const v1 = new Vec2(8, 9);
    const v2 = new Vec2(2, 3);
    const result = v1.div(v2);
    expect(result.x).toBe(4);
    expect(result.y).toBe(3);
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

  it('calculates magnitude', () => {
    const v = new Vec2(3, 4);
    expect(v.magnitude()).toBe(5);
  });

  it('normalizes a vector', () => {
    const v = new Vec2(3, 4);
    const n = v.normalize();
    expect(n.x).toBeCloseTo(0.6);
    expect(n.y).toBeCloseTo(0.8);
  });

  it('throws on normalizing zero vector', () => {
    const v = new Vec2(0, 0);
    expect(() => v.normalize()).toThrow();
  });

  it('scales a vector', () => {
    const v = new Vec2(2, 3);
    const s = v.scale(5);
    expect(s.x).toBe(10);
    expect(s.y).toBe(15);
  });

  it('translates a vector', () => {
    const v = new Vec2(1, 2);
    v.translate(new Vec2(3, 4));
    expect(v.x).toBe(4);
    expect(v.y).toBe(6);
  });

  it('clones a vector', () => {
    const v = new Vec2(7, 8);
    const c = v.clone();
    expect(c.x).toBe(7);
    expect(c.y).toBe(8);
    expect(c).not.toBe(v);
  });
});