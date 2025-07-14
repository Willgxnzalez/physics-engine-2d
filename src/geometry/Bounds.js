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

import { Vec2 } from './Vec2.js';

export class Bounds { 
    constructor(min = new Vec2(Infinity, Infinity), max = new Vec2(-Infinity, -Infinity)) {
        this.min = min;
        this.max = max;
    }

    // Create bounds from an array of vertices
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

        return new Bounds(new Vec2(minX, minY), new Vec2(maxX, maxY));
    }

    // Check if a point is inside the bounds
    contains(point) {
        return (point.x >= this.min.x &&
                point.x <= this.max.x &&
                point.y >= this.min.y &&
                point.y <= this.max.y
        );
    }

    // Check if another AABB overlaps
    overlaps(otherBounds) {
        return (this.min.x < otherBounds.max.x &&
                this.max.x > otherBounds.min.x &&
                this.min.y < otherBounds.max.y &&
                this.max.y > otherBounds.min.y
        );
    }

    // Translate bounds by a given offset in-place
    translate(offset) {
        this.min.translate(offset);
        this.max.translate(offset);
    }
}
