/**
 * Utility class for working with arrays of vertices.
 * Vertices must be in **counter-clockwise (CCW)** order.
 */

import { Vec2 } from './Vec2.js';

export class Vertices {
    constructor(pointsArray = []) {
        this._points = pointsArray.map(p => p instanceof Vec2 ? p : new Vec2(p.x, p.y));
    }

    get points() {
        return this._points.map(p => p.clone());
    }
    
    get length() {
        return this._points.length;
    }

    // Iterator
    *[Symbol.iterator]() {
        for (const point of this._points) {
            yield point;
        }
    }

    at(index) {
        if (index < 0 || index >= this._points.length) {
            throw new Error('Index out of bounds');
        }
        return this._points[index];
    }

    // Immutable operations
    rotate(angle) {
        return new Vertices(this._points.map(p => p.rotate(angle)));
    }

    translate(offset) {
        return new Vertices(this._points.map(p => p.add(offset)));
    }

    // Mutating operations
    rotateInPlace(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        for (const p of this._points) {
            const x = p.x;
            const y = p.y;
            p.x = x * cos - y * sin;
            p.y = x * sin + y * cos;
        }
        return this;
    }

    translateInPlace(offset) {
        for (const p of this._points) {
            p.translate(offset);
        }
        return this;
    }

    area () {
        if (this._points.length < 3) {
            throw new Error('At least 3 points are required to calculate area');
        }
        
        // Using the shoelace formula
        // https://en.wikipedia.org/wiki/Shoelace_formula
        let area = 0;
        for (let i = 0; i < this._points.length; i++) {
            const p0 = this._points[i];
            const p1 = this._points[(i + 1) % this._points.length];
            area += p0.x * p1.y - p1.x * p0.y;
        }
        return area / 2;
    }

    centroid () {
        if (this._points.length < 3) {
            throw new Error('At least 3 points are required to calculate centroid');
        }

        let cx = 0, cy = 0, area = this.area();
        for (let i = 0; i < this._points.length; i++) {
            const p0 = this._points[i];
            const p1 = this._points[(i + 1) % this._points.length];
            const factor = (p0.x * p1.y - p1.x * p0.y);
            cx += (p0.x + p1.x) * factor;
            cy += (p0.y + p1.y) * factor;
        }
        return new Vec2(cx / (6 * area), cy / (6 * area));
    }

    /**
     * Compute edge normals to be used as axes for SAT collision detection
     * @returns {Vec2[]} Array of edge normals
     */
    normals() {
        const normals = [];
        for (let i = 0; i < this._points.length; i++) {
            const p0 = this._points[i];
            const p1 = this._points[(i+1) % this._points.length];
            const normal = new Vec2(p1.y - p0.y, p0.x - p1.x).norm();
            normals.push(normal);
        }
        return normals;
    }

    /**
     * Project the vertices onto an axis
     * @param {Vec2} axis - The axis to project onto
     * @returns {{min: number, max: number}} The minimum and maximum values of the projection
     */
    project(axis) {
        let min = Infinity, max = -Infinity;
        for (const vertex of this._points) {
            const project = vertex.dot(axis);
            min = Math.min(min, project);
            max = Math.max(max, project);
        }
        return { min, max };
    }

    clone() {
        return new Vertices(this._points.map(p => p.clone()));
    }
}