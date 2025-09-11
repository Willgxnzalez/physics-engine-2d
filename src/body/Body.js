import { Vec2 } from '../geometry/Vec2.js';
import { Vertices } from '../geometry/Vertices.js';
import { Bounds } from '../geometry/Bounds.js';

/**
 * Represents a rigid body in 2D space.
 * Handles position, velocity, forces, and geometry for physics simulation.
 */
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
        restitution = 0.1,
        friction = 0.3,
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

        // Material properties
        this.restitution = restitution;
        this.friction = friction;

        // Geometry and shape properties
        this.localVertices = new Vertices(vertices);
        this.vertices = this.localVertices.clone();
        this.bounds = new Bounds();
        this.type = type;
        this.width = width;
        this.height = height;
        this.radius = radius;
        
        // Physical properties
        this.isStatic = isStatic;
        this.mass = this.isStatic ? Infinity : mass;
        this.inertia = this.isStatic ? Infinity : (inertia ?? this._computeInertia());
        this.invMass = this.isStatic ? 0 : 1 / this.mass;
        this.invInertia = (this.isStatic || this.inertia === 0) ? 0 : 1 / this.inertia;
        
        this.updateWorldVerticesAndBounds();
        Object.assign(this, props);
    }

    makeStatic() {
        this.isStatic = true;
        this.mass = Infinity;
        this.inertia = Infinity;
        this.invMass = 0;
        this.invInertia = 0;
        this.velocity.set(0, 0);
        this.angularVelocity = 0;
    }
    
    makeDynamic(mass) {
        if (typeof mass !== 'number' || !isFinite(mass) || mass <= 0) {
            throw new Error('Dynamic bodies require a positive mass');
        }
        this.isStatic = false;
        this.mass = mass;
        this.invMass = 1 / mass;
        this.inertia = this._computeInertia();
        this.invInertia = this.inertia === 0 ? 0 : 1 / this.inertia;
        this.updateWorldVerticesAndBounds();
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
        this.updateWorldVerticesAndBounds();
    }

    setAngle(angle) {
        this.angle = angle;
        this.updateWorldVerticesAndBounds();
    }

    setTransform(position, angle) {
        this.position.set(position.x, position.y);
        this.angle = angle;
        this.updateWorldVerticesAndBounds();
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
        this.force.addEq(force);
    }

    applyForceAtPoint(force, point) {
        if (this.isStatic) return;
        this.applyForce(force);
        const r = point.sub(this.position);
        this.torque += r.cross(force);
    }

    applyTorque(torque) {
        if (this.isStatic) return;
        this.torque += torque;
    }

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
                return this.mass * 0.01;
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

    updateWorldVerticesAndBounds() {
        if (this.type === 'circle') {
            this.bounds.set(
                this.position.x - this.radius,
                this.position.y - this.radius,
                this.position.x + this.radius,
                this.position.y + this.radius
            );
        } else {
            this.vertices = this.localVertices.clone();
            if (this.angle !== 0) this.vertices.rotateInPlace(this.angle);
            this.vertices.translateInPlace(this.position);
            this.bounds.updateFromVertices(this.vertices.points);
        }
    }

    update(dt) {
        if (this.isStatic) return;

        // Angular integration
        this.angularVelocity += this.torque * this.invInertia * dt;
        this.angle += this.angularVelocity * dt;
        
        // Normalize angle
        this.angle = ((this.angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

        // Linear integration
        const acceleration = this.force.scale(this.invMass);
        this.velocity.addEq(acceleration.scale(dt));
        this.position.addEq(this.velocity.scale(dt));

        // Update world transform
        this.updateWorldVerticesAndBounds();

        // Clear forces
        this.force.set(0, 0);
        this.torque = 0;
    }
}