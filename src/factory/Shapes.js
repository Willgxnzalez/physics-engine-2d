import { Body } from '../body/Body.js';
import { Vec2 } from '../geometry/Vec2.js';

export class Shapes {
    static rectangle(x, y, width, height, options = {}) {
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
            vertices: verts
        });
    }

    static Circle(x, y, radius, segments = 32, options = {}) {
        if (segments < 3) {
            throw new Error('Circle must have at least 3 segments');
        }
        const verts = [];

        for (let i = 0; i< segments; i++) {
            const ratio = i / segments;
            const angle = ratio * Math.PI * 2; // 2 * PI for full circle
            verts.push(new Vec2(Math.cos(angle) * radius, Math.sin(angle) * radius));
        }

       return new Body({
           ...options,
           position: new Vec2(x, y),
           vertices: verts
       });
   }
}
