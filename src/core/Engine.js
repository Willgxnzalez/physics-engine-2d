import { Detector } from '../collision/Detector.js'
import { Resolver } from '../collision/Resolver.js'

export class Engine {
    constructor() {
        this.bodies = [];
        this.forces = new Map();
        this.detector = new Detector();
        this.resolver = new Resolver();
        this._manifolds = [];
        this._collisionEnabled = true;
    }

    enableCollisions() { this._collisionEnabled = true; }
    disableCollisions() { this._collisionEnabled = false; }

    addBody(body) { this.bodies.push(body); }
    removeBody(body) {
        const index = this.bodies.indexOf(body);
        if (index !== -1) this.bodies.splice(index, 1);
    }

    addForce(force) { this.forces.set(force.name, force); }
    removeForce(name) { return this.forces.delete(name); }
    getForce(name) { return this.forces.get(name); }

    update(dt) {
        const subSteps = 2;
        const dtStep = dt / subSteps;
        
        for (let s = 0; s < subSteps; s++) {
            // Update forces
            for (const force of this.forces.values()) {
                if (!force.enabled) continue;
                force.update?.(dtStep);
            }

            // Apply forces to bodies
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

            // Integrate bodies
            for (const body of this.bodies) {
                body.update(dtStep);
            }

            // Resolve collisions
            if (this._collisionEnabled) {
                this._manifolds = this.detector.detect(this.bodies);
                this.resolver.resolve(this._manifolds, dtStep);
            }
        }
    }

    reset() {
        this.bodies = [];
        this.forces.clear();
    }

    getManifolds() { return this._manifolds; }
    getAllContacts() { return this._manifolds.flatMap(m => m.contacts); }
}