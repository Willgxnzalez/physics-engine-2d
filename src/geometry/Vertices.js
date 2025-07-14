/**
 * Utility class for working with arrays of vertices.
 * Vertices must be in **counter-clockwise (CCW)** order.
 */

import { Vec2 } from './Vec2.js';

export class Vertices {
    constructor(pointsArray = []) {
        this._points = pointsArray.map(p => p instanceof Vec2 ? p : new Vec2(p.x, p.y));
    }

    clone() {
        return new Vertices(this._points.map(p => p.clone()));
    }

    get length() {
        return this._points.length;
    }

    at(index) {
        if (index < 0 || index >= this._points.length) {
            throw new Error('Index out of bounds');
        }
        return this._points[index];
    }

    // Iterator
    *[Symbol.iterator]() {
        for (const point of this._points) {
            yield point;
        }
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
}