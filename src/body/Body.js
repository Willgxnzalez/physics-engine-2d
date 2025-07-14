/**
 * A Rigid body in 2D space.
 * Uses mutating operations for performance where it makes sense.
 */

import { Vec2 } from '../geometry/Vec2.js';
import { Vertices } from '../geometry/Vertices.js';
import { Bounds } from '../geometry/Bounds.js';

export class Body {
    constructor({
        position = new Vec2(0, 0),
        velocity = new Vec2(0, 0),
        isStatic = false,
        mass = 1,
        vertices = []

    } = {}) {
        this.position = position.clone();
        this.velocity = velocity.clone();

        this.isStatic = !!isStatic;
        this.mass = this.isStatic ? Infinity : mass;

        this.localVertices = new Vertices(vertices);
        this.vertices = [];
        this.updateWorldVertices();

        this.bounds = Bounds.fromVertices(this.vertices);
    }

    updateWorldVertices() {
        this.vertices = this.localVertices.clone();
        this.vertices.translateInPlace(this.position);
    }

    update(dt, gravity) {
        if (this.isStatic) return;

        // Integrate position using Semi-Implicit Euler
        this.velocity.y += gravity * dt;
        this.position.translate(this.velocity.scale(dt));

        // Update world transform
        this.updateWorldVertices();
        this.bounds = Bounds.fromVertices(this.vertices);
    }
}