import { Vec2 } from '../geometry/Vec2.js';

export class Resolver {
    constructor({ iterations = 10 } = {}) {
      this.iterations = iterations; // solver iterations for stability
      this._cachedImpulses = new Map(); // future warm starting
    }
  
    resolve(manifolds, dt) {
      // Phase 1: Resolve velocities (impulse resolution)
      for (let i = 0; i < this.iterations; i++) {
        for (const m of manifolds) {
          this._resolveVelocity(m, dt);
        }
      }
  
      // Phase 2: Resolve positions (positional correction)
      for (const m of manifolds) {
        this._resolvePosition(m);
      }
    }
  
    _resolveVelocity(m, dt) {
      const A = m.referenceBody;
      const B = m.incidentBody;
  
      if (A.isStatic && B.isStatic) return;
  
      for (const contact of m.contacts) {
        // rA, rB: vectors from COM to contact
        const rA = contact.sub(A.position);
        const rB = contact.sub(B.position);
  
        // relative velocity at contact
        const vA = A.velocity.add(new Vec2(-A.angularVelocity * rA.y, A.angularVelocity * rA.x));
        const vB = B.velocity.add(new Vec2(-B.angularVelocity * rB.y, B.angularVelocity * rB.x));
        const rv = vB.sub(vA);
  
        const velAlongNormal = rv.dot(m.normal);
        if (velAlongNormal > 0) continue; // separating
  
        const e = Math.min(A.restitution ?? 0.2, B.restitution ?? 0.2); // bounciness
        const j = -(1 + e) * velAlongNormal /
          (A.invMass + B.invMass +
           rA.cross(m.normal) ** 2 * A.invInertia +
           rB.cross(m.normal) ** 2 * B.invInertia);
  
        const impulse = m.normal.scale(j);
  
        if (!A.isStatic) {
          A.velocity.subEq(impulse.scale(A.invMass));
          A.angularVelocity -= rA.cross(impulse) * A.invInertia;
        }
        if (!B.isStatic) {
          B.velocity.addEq(impulse.scale(B.invMass));
          B.angularVelocity += rB.cross(impulse) * B.invInertia;
        }
      }
    }
  
    _resolvePosition(m) {
      const A = m.referenceBody;
      const B = m.incidentBody;
      if (A.isStatic && B.isStatic) return;
  
      const percent = 0.2; // percentage of overlap to resolve this frame - not completely in one step
      const slop = 0.01;   // penetration allowance - don't resolve unnoticable penetration
  
      const correctionMag = Math.max(m.penetration - slop, 0) / (A.invMass + B.invMass) * percent;
      const correction = m.normal.scale(correctionMag);
  
      if (!A.isStatic) {
        A.position.subEq(correction.scale(A.invMass));
      }
      if (!B.isStatic) {
        B.position.addEq(correction.scale(B.invMass));
      }
  
      // update vertices/bounds
      A._updateWorldVerticesAndBounds();
      B._updateWorldVerticesAndBounds();
    }
  }
  