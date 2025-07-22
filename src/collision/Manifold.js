import { Vec2 } from '../geometry/Vec2.js';
/**
 * Manifold class for storing collision information between two bodies.
 */
export class Manifold {
    constructor(bodyA, bodyB) {
        this.bodyA = bodyA;
        this.bodyB = bodyB;
        this.normal = new Vec2(0, 0);        // Direction of collision resolution (from A to B) pointing from reference to incident body
        this.penetration = 0;                // Penetration depth
        this.contacts = [];
    }

    /**
     * Check if this manifold has valid contact information
     * @returns {boolean} True if manifold has valid collision data
     */
    isValid() {
        return this.contacts.length > 0 && this.penetration > 0;
    }

    /**
     * Get the minimum translation vector
     * @returns {Vec2} The minimum translation vector
     */
    mtv() {
        return this.normal.scale(this.penetration)
    }
}