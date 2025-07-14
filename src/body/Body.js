/**
 * A Rigid body in 2D space.
 */

import { Vec2 } from '../geometry/Vec2.js';
import { Bounds } from '../geometry/Bounds.js';

export class Body {
    constructor({
        position = new Vec2(0, 0),
        velocity = new Vec2(0, 0),
        angle = 0, // in radians
        isStatic = false,
        mass = 1,
        vertices = []
    } = {}) {
        this.position = position.clone();
        this.velocity = velocity.clone();
        this.angle = angle;
        this.isStatic = !!isStatic;
        this.mass = this.isStatic ? Infinity : mass;

        this.localVertices = vertices; // original shape around (0,0) in CCW order
        this.vertices = [];  // world space vertices

        this.computeWorldVertices();
        this.bounds = Bounds.fromVertices(this.vertices);
    }

    computeWorldVertices() {
        const cos = Math.cos(this.angle);
        const sin = Math.sin(this.angle);

        this.vertices = this.localVertices.map(v =>
            new Vec2(
                v.x * cos - v.y * sin + this.position.x,
                v.x * sin + v.y * cos + this.position.y
            )
        );
    }

    update(dt, gravity) {
        if (this.isStatic) return;

        this.velocity.y += gravity* dt; // Semi-implicit Euler integration
        this.position.translate(this.velocity.scale(dt));

        this.computeWorldVertices();
        this.bounds = Bounds.fromVertices(this.vertices);
    }
}
