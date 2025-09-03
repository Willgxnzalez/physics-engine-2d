import { Vec2 } from './Vec2.js';

/**
 * Utility class for working with arrays of vertices.
 * Vertices must be in **counter-clockwise (CCW)** order.
 */
export class Vertices {
    constructor(pointsArray = []) {
        this.points = pointsArray.map(p => p instanceof Vec2 ? p.clone() : new Vec2(p.x, p.y));
        this._normals = null;
    }
    
    get length() { return this.points.length; }

    at(index) { return this.points[index]; }
    
    _invalidateCache() { this._normals = null; }

    *[Symbol.iterator]() {
        for (const point of this.points) {
            yield point;
        }
    }

    normals() {
        if (this._normals === null) {   
            this._normals = [];
            for (let i = 0; i < this.points.length; i++) {
                const p0 = this.points[i];
                const p1 = this.points[(i + 1) % this.points.length];
                const edge = p1.sub(p0);
                this._normals.push(edge.perp().normalized());
            }
        }
        return this._normals;
    }

    rotateInPlace(angle) {
        if (angle === 0) return this;
        
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        for (const p of this.points) {
            const x = p.x;
            const y = p.y;
            p.x = x * cos - y * sin;
            p.y = x * sin + y * cos;
        }
        this._invalidateCache();
        return this;
    }

    translateInPlace(offset) {
        for (const p of this.points) {
            p.translateEq(offset);
        }
        return this;
    }

    project(axis) {
        let min = this.points[0].dot(axis);
        let max = min;
        
        for (let i = 1; i < this.points.length; i++) {
            const projection = this.points[i].dot(axis);
            if (projection < min) min = projection;
            if (projection > max) max = projection;
        }
        return { min, max };
    }

    clone() { return new Vertices(this.points); }
}