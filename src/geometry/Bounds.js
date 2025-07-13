/**
 * Bounds (Axis-Aligned Bounding Box - AABB)
 * 
 * Used for:
 * - Broad-phase collision rejection
 * - Fast overlap checks before SAT
 * - Spatial partitioning (grids, quad trees, etc.)
 * 
 * Stores `min` and `max` points, provides useful spatial methods.
 */

export class Bounds { 
    constructor(min = new Vec2(Infinity, Infinity), max = new Vec2(-Infinity, -Infinity)) {
        this.min = min;
        this.max = max;
    }

    static fromVertices(vertices) {
        if (!vertices || vertices.length === 0) {
            return null;
        }

        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;

        for (const v of vertices) {
            if (v.x < minX) minX = v.x;
            if (v.x > maxX) maxX = v.x;
            if (v.y < minY) minY = v.y;
            if (v.y > maxY) maxY = v.y;
        }

        return { min: new Vec2(minX, minY), max: new Vec2(maxX, maxY) };
    }
}