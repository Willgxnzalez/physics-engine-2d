import { Vec2 } from '../geometry/Vec2.js';

export class Engine {
  constructor() {
    this.bodies = [];
    this.gravityEnabled = true;
    this.gravityStrength = 100;
    this.gravityDirection = new Vec2(0, 1); // Downward unit vector
    this.forces = [];
    

    this.gravityForce = (body) => {
      if (this.gravityEnabled && !body.isStatic) 
        return this.gravityDirection.scale(this.gravityStrength * body.mass);
      return null;
    };
    this.addForce(this.gravityForce);
  }

  addBody(body) {
    this.bodies.push(body);
  }

  addForce(forceFunction) {
    this.forces.push(forceFunction);
  }

  removeForce(forceFunction) {
    const index = this.forces.indexOf(forceFunction);
    if (index > -1) {
      this.forces.splice(index, 1);
    }
  }

  enableGravity() {
    this.gravityEnabled = true;
  }

  disableGravity() {
    this.gravityEnabled = false;
  }

  setGravityStrength(strength) {
    this.gravityStrength = strength;
  }

  setGravityDirection(directionVec2) {
    this.gravityDirection = directionVec2.normalize();
  }

  update(dt) {
    for (const forceFunction of this.forces) {
      for (const body of this.bodies) {
        const force = forceFunction(body);
        if (force) {
          body.applyForce(force);
        }
      }
    }

    for (const body of this.bodies) {
      body.update(dt);
    }
  }
}
