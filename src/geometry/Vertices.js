/**
 * Utility class for working with arrays of 2D vertices.
 */

import { Vec2 } from './Vec2.js';

export class Vertices {
    static create(pointsArray) {
        return pointsArray.map(p => new Vec2(p.x, p.y));
    }

    static translate(vertices, offset) {
        for (const v of vertices) {
            v.translate(offset);
        }
    }
}