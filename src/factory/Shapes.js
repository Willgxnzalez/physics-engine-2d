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
}
