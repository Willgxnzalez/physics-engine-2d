import { Vec2 } from './Vec2.js';

export class Vertices {
    static create(pointsArray) {
        return pointsArray.map(p => new Vec2(p.x, p.y));
    }

    /**
     * Translates an array of vertices by a given offset in-place.
     * @param {Vec2[]} vertices - The array of vertices to translate.
     * @param {Vec2} offset - The offset vector by which to translate the vertices.
     */
    static translate(vertices, offset) {
        for (const v of vertices) {
            v.x += offset.x;
            v.y += offset.y;
        }
    }
}