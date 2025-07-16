/**
 * Represents a rigid body in 2D space.
 * Handles position, velocity, forces, and geometry for physics simulation.
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
        // Motion
        this.position = position.clone();
        this.velocity = velocity.clone();
        this.angle = 0; // Rotation angle in radians
        this.angularVelocity = 0; // Angular velocity in radians per second

        // Forces and torques
        this.force = new Vec2(0, 0); // Accumulated force per frame
        this.torque = 0; // Scalar torque in 2D per frame

        // Physical properties
        this.isStatic = !!isStatic;
        this.mass = this.isStatic ? Infinity : mass;
        this.invMass = this.isStatic ? 0 : 1 / mass;
        this.inertia = this.isStatic ? Infinity : mass * 0.01;
        this.invInertia = this.isStatic ? 0 : 1 / this.inertia

        // Geometry
        this.localVertices = new Vertices(vertices);
        this.vertices = null;
        
        this.updateWorldVertices();
        this.bounds = Bounds.fromVertices(this.vertices);
    }

    /**
     * Apply a force to the body for this frame
     * @param {Vec2} force - The force vector to apply
     */
    applyForce(force) {
        if (this.isStatic) return;
        this.force.translate(force);
    }

    /**
     * Applies a force at a specific point on body (world space), causing torque.
     * @param {Vec2} point - World space point
     * @param {Vec2} force - Force vector
     */
    applyForceAtPoint(force, point) {
        if (this.isStatic) return;

        this.applyForce(force);
        // Calculate torque: τ = r x F, where r is the vector from body center to point
        const r = point.clone().sub(this.position);
        this.torque += r.cross(force);
    }

    updateWorldVertices() {
        this.vertices = this.localVertices.clone();
        this.vertices.rotateInPlace(this.angle);
        this.vertices.translateInPlace(this.position);
    }

    update(dt) {
        if (this.isStatic) return;

        this.angularVelocity += this.torque * this.invInertia * dt; // Update angular velocity
        this.angle += this.angularVelocity * dt;
        this.angle = (this.angle + 2 * Math.PI) % (2 * Math.PI); // Normalize angle to [0, 2π)

        // Semi-Implicit Euler integration
        // Calculate acceleration from accumulated forces (F = ma, so a = F/m)
        const acceleration = this.force.scale(this.invMass);
        this.velocity.translate(acceleration.scale(dt)); // Update velocity first: v = v + a * dt
        this.position.translate(this.velocity.scale(dt));  // Then update position: p = p + v * dt

        // Update world transform
        this.updateWorldVertices();
        this.bounds = Bounds.fromVertices(this.vertices);

        // Clear accumulated forces for next frame
        this.force = new Vec2(0, 0);
        this.torque = 0;
    }
}