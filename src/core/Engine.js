import { Vec2 } from '../geometry/Vec2.js';
import { GravityForce } from './Force.js';

export class Engine {
  constructor() {
    this.bodies = [];
    this.forces = new Map(); // Map<name, Force>
    this.paused = false;

    // Initialize with gravity
    this.addForce(new GravityForce({ strength: 100 }));
  }

  addBody(body) {
    this.bodies.push(body);
  }

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
    return Array.from(this.forces.values()).filter(force => force.enabled);
  }

  pause() {
    this.paused = true;
  }

  isPaused() {
    return this.paused;
  }

  resume() {
    this.paused = false;
  }

  enableGravity() {
    this.enableForce('gravity');
  }

  disableGravity() {
    this.disableForce('gravity');
  }

  setGravityStrength(strength) {
    const gravity = this.getForce('gravity');
    if (gravity) gravity.setStrength(strength);
  }

  setGravityDirection(directionVec2) {
    const gravity = this.getForce('gravity');
    if (gravity) gravity.setDirection(directionVec2);
  }

  update(dt) {
    if (this.paused) return;

    // Update all forces (for time-based behavior)
    for (const force of this.forces.values()) {
      if (force.enabled) {
        force.update(dt);
      }
    }

    // Apply all forces to all bodies
    for (const force of this.forces.values()) {
      if (!force.enabled) continue;
      
      for (const body of this.bodies) {
        if (force.shouldApplyTo(body)) {
          const forceVector = force.calculate(body, dt);
          if (forceVector) {
            body.applyForce(forceVector);
          }
        }
      }
    }

    for (const body of this.bodies) {
      body.update(dt);
    }
  }
}
