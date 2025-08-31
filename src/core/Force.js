import { Vec2 } from '../geometry/Vec2.js';

/**
 * Base Force class - all forces inherit from this
 */
// Force.js
export class Force {
    constructor(name, options = {}) {
        this.name = name;
        this.enabled = options.enabled ?? true;
    }

    /**
     * Determines if this force should be applied to a body
     * @param {Body} body - The body to check
     * @returns {boolean} - True if force should be applied
     */
    shouldApplyTo(body) {
        return !body.isStatic;
    }

    /**
     * Apply the force to a body.
     * @param {Body} body - The body to apply force to
     */
    apply(body) { throw new Error('Force.apply() must be implemented by subclass'); }

    /**
     * Enable this force
     */
    enable() { this.enabled = true; }

    /**
     * Disable this force
     */
    disable() { this.enabled = false; }

    /**
     * Update internal parameters (called once per frame)
     * @param {number} dt - Delta time
     */
    update(dt) {}
}

/**
 * Gravity Force
 */
export class GravityForce extends Force {
    constructor(options = {}) {
        super('gravity', options);
        this.strength = options.strength ?? 100;
        this.direction = options.direction ?? new Vec2(0, 1);
    }

    apply(body) {
        return this.direction.scale(this.strength * body.mass);
    }

    setStrength(strength) {
        this.strength = strength;
    }

    setDirection(direction) {
        this.direction = direction.normalize();
    }
}