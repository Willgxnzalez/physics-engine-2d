import { Body } from '../body/Body.js';
import { Vec2 } from '../geometry/Vec2.js';

export class Shapes {
    static Rect(x, y, width, height, options = {}) {
        if (width == null || height == null) {
            throw new Error('Rectangle requires width and height');
        }

        const hw = width / 2;
        const hh = height / 2;

        const verts = [
            new Vec2(-hw, -hh),
            new Vec2(hw, -hh),
            new Vec2(hw, hh),
            new Vec2(-hw, hh)
        ];

        return new Body({
            ...options,
            position: new Vec2(x, y),
            vertices: verts,
            type: 'rectangle',
            width,
            height
        });
    }

    static Circle(x, y, radius, segments = 32, options = {}) {
        if (radius == null) {
            throw new Error('Circle requires a radius');
        }

        if (segments < 3) {
            throw new Error('Circle must have at least 3 segments');
        }

        const verts = [];
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            verts.push(new Vec2(Math.cos(angle) * radius, Math.sin(angle) * radius));
        }

        return new Body({
            ...options,
            position: new Vec2(x, y),
            vertices: verts,
            type: 'circle',
            radius,
            segments
        });
    }

}
