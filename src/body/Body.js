/**
 * A rigid body in 2D space.
 */

import { Vec2 } from "../geometry/Vec2.js";
import { Bounds } from "../geometry/Bounds.js";
import { Vertices } from "../geometry/Vertices.js";

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

        this.vertices = vertices;
        this.bounds = Bounds.fromVertices(this.vertices);
        console.log(`Created body at ${this.position.x}, ${this.position.y} with mass ${this.mass} and static status ${this.isStatic} with bounds: ${JSON.stringify(this.bounds)}`);
    }

    update(dt, gravity) {
        if (this.isStatic) return;

        this.velocity.y += gravity.y * dt;

        const displacement = this.velocity.scale(dt);
        this.position.translate(displacement);

        Vertices.translate(this.vertices, displacement);
        this.bounds.translate(displacement);
    }
}
