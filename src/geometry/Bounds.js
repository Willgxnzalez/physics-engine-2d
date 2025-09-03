import { Vec2 } from './Vec2.js';

/**
 * Bounds (Axis-Aligned Bounding Box - AABB)
 * 
 * Used for:
 * - Broad-phase collision rejection
 * - Fast overlap checks before SAT
 * - Spatial partitioning (grids, quad trees, etc.)
 */
export class Bounds { 
    constructor(minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity) {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    // Update bounds from vertices
    updateFromVertices(vertices) {
        this.minX = Infinity;
        this.minY = Infinity;
        this.maxX = -Infinity;
        this.maxY = -Infinity;

        for (const vertex of vertices) {
            if (vertex.x < this.minX) this.minX = vertex.x;
            if (vertex.x > this.maxX) this.maxX = vertex.x;
            if (vertex.y < this.minY) this.minY = vertex.y;
            if (vertex.y > this.maxY) this.maxY = vertex.y;
        }
    }

    overlaps(other) {
        return (this.minX < other.maxX &&
                this.maxX > other.minX &&
                this.minY < other.maxY &&
                this.maxY > other.minY);
    }

    contains(point) {
        return (point.x >= this.minX &&
                point.x <= this.maxX &&
                point.y >= this.minY &&
                point.y <= this.maxY);
    }
}