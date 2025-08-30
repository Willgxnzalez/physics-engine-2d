import { Vec2 } from '../geometry/Vec2.js';

/**
 * Base Force class - all forces inherit from this
 */
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
    shouldApplyTo(body) { return !body.isStatic; }

    /**
     * Calculate the force vector for a given body
     * @param {Body} body - The body to calculate force for
     * @param {number} dt - Delta time
     * @returns {Vec2|null} - Force vector or null if no force
     */
    calculate(body, dt) { throw new Error('Force.calculate() must be implemented by subclass'); }

    /**
     * Enable this force
     */
    enable() { this.enabled = true; }

    /**
     * Disable this force
     */
    disable() { this.enabled = false; }

    /**
     * Toggle this force on/off
     */
    toggle() { this.enabled = !this.enabled; }

    /**
     * Update force parameters (called before each frame)
     * @param {number} dt - Delta time
     */
    update(dt) {}
}

/**
 * Gravity Force - pulls bodies downward
 */
export class GravityForce extends Force {
    constructor(options = {}) {
        super('gravity', options);
        this.strength = options.strength ?? 100;
        this.direction = options.direction ?? new Vec2(0, 1);
    }

    shouldApplyTo(body) {
        return !body.isStatic;
    }

    calculate(body, dt) {
        return this.direction.scale(this.strength * body.mass);
    }

    setStrength(strength) {
        this.strength = strength;
    }

    setDirection(direction) {
        this.direction = direction.normalize();
    }
}