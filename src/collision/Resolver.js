import { Vec2 } from '../geometry/Vec2.js';

export class Resolver {
    constructor({ iterations = 8, positionCorrection = 0.2, slop = 0.02 } = {}) {
        this.iterations = iterations;
        this.positionCorrection = positionCorrection;
        this.slop = slop;
    }

    resolve(manifolds, dt) {
        // Phase 1: Resolve velocities
        for (let i = 0; i < this.iterations; i++) {
            for (const manifold of manifolds) {
                this._resolveVelocity(manifold, dt);
            }
        }
        
        // Phase 2: Resolve positions
        for (const manifold of manifolds) {
            this._resolvePosition(manifold);
        }
    }

    _resolveVelocity(manifold, dt) {
        const bodyA = manifold.referenceBody;
        const bodyB = manifold.incidentBody;
    
        if (bodyA.isStatic && bodyB.isStatic) return;
    
        const e = Math.min(bodyA.restitution, bodyB.restitution);
        const friction = Math.sqrt(bodyA.friction * bodyB.friction);
    
        for (const contact of manifold.contacts) {
            const rA = contact.sub(bodyA.position);
            const rB = contact.sub(bodyB.position);
    
            // Relative velocity at contact point
            const vA = bodyA.velocity.add(new Vec2(-bodyA.angularVelocity * rA.y, bodyA.angularVelocity * rA.x));
            const vB = bodyB.velocity.add(new Vec2(-bodyB.angularVelocity * rB.y, bodyB.angularVelocity * rB.x));
            const relativeVelocity = vB.sub(vA);
    
            // Normal impulse
            const velocityAlongNormal = relativeVelocity.dot(manifold.normal);
            if (velocityAlongNormal > 0) continue; // Objects separating
    
            const rAcrossN = rA.cross(manifold.normal);
            const rBcrossN = rB.cross(manifold.normal);
            const normalMass = bodyA.invMass + bodyB.invMass + 
                              rAcrossN * rAcrossN * bodyA.invInertia + 
                              rBcrossN * rBcrossN * bodyB.invInertia;
    
            const j = -(1 + e) * velocityAlongNormal / normalMass;
            const impulse = manifold.normal.scale(j);
    
            // Apply normal impulse
            if (!bodyA.isStatic) {
                bodyA.velocity.subEq(impulse.scale(bodyA.invMass));
                bodyA.angularVelocity -= rA.cross(impulse) * bodyA.invInertia;
            }
            if (!bodyB.isStatic) {
                bodyB.velocity.addEq(impulse.scale(bodyB.invMass));
                bodyB.angularVelocity += rB.cross(impulse) * bodyB.invInertia;
            }
    
            // Friction impulse
            const updatedVA = bodyA.velocity.add(new Vec2(-bodyA.angularVelocity * rA.y, bodyA.angularVelocity * rA.x));
            const updatedVB = bodyB.velocity.add(new Vec2(-bodyB.angularVelocity * rB.y, bodyB.angularVelocity * rB.x));
            const updatedRelativeVelocity = updatedVB.sub(updatedVA);
    
            const tangent = updatedRelativeVelocity.sub(manifold.normal.scale(updatedRelativeVelocity.dot(manifold.normal)));
            if (tangent.mag() < 1e-6) continue; // Avoid division by near-zero
    
            const velocityAlongTangent = updatedRelativeVelocity.dot(tangent.normalize());
            if (Math.abs(velocityAlongTangent) < 0.01) continue; // Threshold to stop small movements
    
            const rAcrossT = rA.cross(tangent);
            const rBcrossT = rB.cross(tangent);
            const tangentMass = bodyA.invMass + bodyB.invMass + 
                                rAcrossT * rAcrossT * bodyA.invInertia + 
                                rBcrossT * rBcrossT * bodyB.invInertia;
    
            let jt = -velocityAlongTangent / tangentMass;
            const maxFriction = Math.abs(j * friction);
            jt = Math.max(-maxFriction, Math.min(jt, maxFriction));
    
            const frictionImpulse = tangent.normalize().scale(jt);
    
            // Apply friction impulse
            if (!bodyA.isStatic) {
                bodyA.velocity.subEq(frictionImpulse.scale(bodyA.invMass));
                bodyA.angularVelocity -= rA.cross(frictionImpulse) * bodyA.invInertia;
            }
            if (!bodyB.isStatic) {
                bodyB.velocity.addEq(frictionImpulse.scale(bodyB.invMass));
                bodyB.angularVelocity += rB.cross(frictionImpulse) * bodyB.invInertia;
            }
        }
    }

    _resolvePosition(manifold) {
        const bodyA = manifold.referenceBody;
        const bodyB = manifold.incidentBody;
    
        if (bodyA.isStatic && bodyB.isStatic) return;
    
        const clampedPenetration = Math.min(manifold.penetration, 1.0);
    
        const correctionMagnitude = Math.max(clampedPenetration - this.slop, 0) / 
                                   (bodyA.invMass + bodyB.invMass) * this.positionCorrection;
    
        const correction = manifold.normal.scale(correctionMagnitude);
    
        if (bodyA.isStatic) {
            bodyB.position.addEq(correction);
            bodyB.updateWorldVerticesAndBounds();
        } else if (bodyB.isStatic) {
            bodyA.position.subEq(correction);
            bodyA.updateWorldVerticesAndBounds();
        } else {
            bodyA.position.subEq(correction.scale(bodyA.invMass));
            bodyB.position.addEq(correction.scale(bodyB.invMass));
            bodyA.updateWorldVerticesAndBounds();
            bodyB.updateWorldVerticesAndBounds();
        }
    }
}