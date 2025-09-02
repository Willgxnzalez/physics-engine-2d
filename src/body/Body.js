/**
 * Represents a rigid body in 2D space.
 * Handles position, velocity, forces, and geometry for physics simulation.
 */

import { Vec2 } from '../geometry/Vec2.js';
import { Vertices } from '../geometry/Vertices.js';
import { Bounds } from '../geometry/Bounds.js';

export class Body {
    constructor({
        vertices = [],
        position = new Vec2(0, 0),
        velocity = new Vec2(0, 0),
        angle = 0,
        angularVelocity = 0,
        mass = 1,
        inertia = null,
        width = null,
        height = null,
        radius = null,
        type = 'polygon',
        isStatic = false,
        ...props
    } = {}) {
        // Motion properties
        this.position = position.clone();
        this.velocity = velocity.clone();
        this.angle = angle;
        this.angularVelocity = angularVelocity;

        // Forces and torques (cleared each frame)
        this.force = new Vec2(0, 0);
        this.torque = 0;

        // Geometry and shape properties
        this.localVertices = new Vertices(vertices);
        this.vertices = null;
        this.bounds = null;
        this.type = type;
        this.width = width;
        this.height = height;
        this.radius = radius;
        this._updateWorldVerticesAndBounds();
        
        Object.assign(this, props); // allow custom properties

        // Physical properties
        this.isStatic = isStatic;
        this.mass = this.isStatic ? Infinity : mass;
        this.inertia = this.isStatic ? Infinity : (inertia ?? this._computeInertia());
        this.invMass = this.isStatic ? 0 : 1 / this.mass;
        this.invInertia = (this.isStatic || this.inertia === 0) ? 0 : 1 / this.inertia;
        
    }

    /**
     * Make the body static (immovable, infinite mass/inertia)
     */
    makeStatic() {
        this.isStatic = true;
        this.mass = Infinity;
        this.inertia = Infinity;
        this.invMass = 0;
        this.invInertia = 0;
        this.velocity.set(0, 0);
        this.angularVelocity = 0;
    }
    
    /**
     * Make the body dynamic (movable) with a given mass
     * @param {number} mass - The mass to assign to the body
     */
    makeDynamic(mass) {
        if (typeof mass !== 'number' || !isFinite(mass) || mass <= 0) {
          throw new Error('Dynamic bodies require a positive mass');
        }
        this.isStatic = false;
        this.mass = mass;
        this.invMass = 1 / mass;
        this.inertia = this._computeInertia();
        this.invInertia = this.inertia === 0 ? 0 : 1 / this.inertia;
    }

    /**
     * Set mass and update derived properties
     * @param {number} value - New mass value
     */
    setMass(value) {
        if (this.isStatic) return;
        this.mass = value;
        this.invMass = 1 / value;
        // Inertia scales with mass, so update it if it was computed
        this.inertia = this._computeInertia();
        this.invInertia = 1 / this.inertia;
    }

    /**
     * Set the position of the body
     * @param {*} x 
     * @param {*} y 
     */
    setPosition(x, y) {
        this.position.set(x, y);
        this._updateWorldVerticesAndBounds();
        this.bounds = Bounds.fromVertices(this.vertices);
    }

    /**
     * Set the angle of the body
     * @param {number} angle - Angle in radians
     */
    setAngle(angle) {
        this.angle = angle;
        this._updateWorldVerticesAndBounds();
        this.bounds = Bounds.fromVertices(this.vertices);
    }

    /**
     * Set both position and angle of the body
     * @param {Vec2} position - New position vector
     * @param {number} angle - New angle in radians
     */
    setTransform(position, angle) {
        this.setPosition(position.x, position.y);
        this.setAngle(angle);
    }

    /**
     * Rotate the body by a given angle (in radians)
     * @param {number} angle - Angle to rotate by (radians)
     */
    rotate(angle) {
        this.setAngle(this.angle + angle);
    }
    
    /**
     * Translate the body by a given offset vector
     * @param {Vec2} offset - Offset vector to translate by
     */
    translate(offset) {
        this.setPosition(this.position.x + offset.x, this.position.y + offset.y);
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
     * @param {Vec2} force - Force vector
     * @param {Vec2} point - World space point
     */
    applyForceAtPoint(force, point) {
        if (this.isStatic) return;

        this.applyForce(force);
        // Calculate torque: τ = r x F, where r is the vector from body center to point
        const r = point.clone().sub(this.position);
        this.torque += r.cross(force);
    }

    /**
     * Apply torque directly to the body
     * @param {number} torque - Torque to apply
     */
    applyTorque(torque) {
        if (this.isStatic) return;
        this.torque += torque;
    }

    /**
     * Compute the moment of inertia for this body
     * @private
     */
    _computeInertia() {
        if (this.type === 'circle') {
            if (this.radius == null) {
                throw new Error("Circle body requires radius to compute inertia.");
            }
            return (this.mass / 2) * this.radius * this.radius;
        } else if (this.type === 'rectangle') {
            if (this.width == null || this.height == null) {
                throw new Error("Rectangle body requires width and height to compute inertia.");
            }
            return (this.mass / 12) * (this.width * this.width + this.height * this.height);
        } else {
            if (this.localVertices.length < 3) {
                return this.mass * 0.01; // Fallback for invalid polygons
            }

            let numerator = 0;
            let denominator = 0;

            for (let i = 0; i < this.localVertices.length; i++) {
                const p0 = this.localVertices.at(i);
                const p1 = this.localVertices.at((i + 1) % this.localVertices.length);

                const cross = Math.abs(p0.cross(p1));
                const term = (p0.x * p0.x + p0.x * p1.x + p1.x * p1.x +
                            p0.y * p0.y + p0.y * p1.y + p1.y * p1.y);

                numerator += cross * term;
                denominator += cross;
            }

            return denominator > 0 ? (this.mass / 6) * (numerator / denominator) : this.mass * 0.01;
        }   
    }

    /**
     * Update world vertices and bounds based on current position and angle
     */
    _updateWorldVerticesAndBounds() {
        this.vertices = this.localVertices.clone();
        if (this.angle !== 0) {
            this.vertices.rotateInPlace(this.angle);
        }
        this.vertices.translateInPlace(this.position);
        this.bounds = Bounds.fromVertices(this.vertices);
    }

    update(dt) {
        if (this.isStatic) return;

        // Angular integration
        this.angularVelocity += this.torque * this.invInertia * dt;
        this.angle += this.angularVelocity * dt;
        this.angle = (this.angle + 2 * Math.PI) % (2 * Math.PI); // Normalize angle in [0, 2π)

        // Linear integration (Semi-Implicit Euler)
        const acceleration = this.force.scale(this.invMass);
        this.velocity.addEq(acceleration.scaleEq(dt));
        this.position.addEq(this.velocity.scale(dt));

        // Update world transform
        this._updateWorldVerticesAndBounds();

        // Clear accumulated forces for next frame
        this.force.set(0, 0);
        this.torque = 0;
    }
}