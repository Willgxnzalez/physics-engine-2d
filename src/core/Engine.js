import { Detector } from '../collision/Detector.js'
import { Resolver } from '../collision/Resolver.js'

export class Engine {
    constructor() {
        this.bodies = [];
        this.forces = new Map(); // Map<name, Force>

        this.detector = new Detector();
        this.resolver = new Resolver();
        this._manifolds = [];

        this._collisionEnabled = true;
    }

    /**
     * Enable collision detection and resolution in the engine.
     */
    enableCollisions() {
    this._collisionEnabled = true;
    }

    /**
     * Disable collision detection and resolution in the engine.
     */
    disableCollisions() {
        this._collisionEnabled = false;
        }

    // --- Bodies ---
    addBody(body) {
        this.bodies.push(body);
    }

    removeBody(body) {
        const index = this.bodies.indexOf(body);
        if (index !== -1) this.bodies.splice(index, 1);
    }

    // --- Forces ---
    addForce(force) {
        this.forces.set(force.name, force);
    }

    removeForce(name) {
        return this.forces.delete(name);
    }

    getForce(name) {
        return this.forces.get(name);
    }

    enableForce(name) {
        const force = this.forces.get(name);
        if (force) force.enable();
    }

    disableForce(name) {
        const force = this.forces.get(name);
        if (force) force.disable();
    }

    listForces() {
        return Array.from(this.forces.keys());
    }

    listEnabledForces() {
        return Array.from(this.forces.values()).filter(f => f.enabled);
    }

    // --- Simulation Step ---
    update(dt) {
        // 1. Update forces that have internal state
        for (const force of this.forces.values()) {
            if (!force.enabled) continue;
            force.update(dt);
        }

        // 2. Apply forces to bodies
        for (const body of this.bodies) {
            if (body.isStatic) continue;

            for (const force of this.forces.values()) {
                if (!force.enabled || !force.shouldApplyTo(body)) continue;

                const result = force.apply(body);
                if (!result) continue;

                if (result.force && result.point) {
                    body.applyForceAtPoint(result.force, result.point);
                } else if (result.force) {
                    body.applyForce(result.force);
                }

                if (result.torque) {
                    body.applyTorque(result.torque);
                }
            }
        }

        // 3. Integrate all bodies
        for (const body of this.bodies) {
            body.update(dt);
        }

        // Save this frame's manifolds
        this._manifolds = this.detector.detect(this.bodies);
        if (this._collisionEnabled) this.resolver.resolve(this._manifolds);
    }

    // --- Convenience methods ---
    reset() {
        this.bodies = []
        this.forces.clear();
    }

    getManifolds() {
        return this._manifolds; 
    }

    getAllContacts() {
        return this._manifolds.flatMap(m => m.allContacts);
    }
}