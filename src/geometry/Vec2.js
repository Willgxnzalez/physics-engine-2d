/**
 * Represents a 2D vector with x and y components.
 * All methods return new instances for immutable operations.
 */
export class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // Core operations
    set(x, y) {
        this.x = x;
        this.y = y;
        return this; 
    } 

    clone() {
        return new Vec2(this.x, this.y);
    }

    // Arithmetic operations
    add(vec) {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }

    sub(vec) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }

    scale(scalar) {
        return new Vec2(this.x * scalar, this.y * scalar);
    }

    negate() {
        return new Vec2(-this.x, -this.y);
    }

    // Geometric operations
    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    cross(vec) {
        return this.x * vec.y - this.y * vec.x; // 2D cross product
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const mag = this.magnitude();
        if (mag === 0) throw new Error("Cannot normalize a zero vector.");
        return new Vec2(this.x / mag, this.y / mag);
    }

    perpendicular() {
        return new Vec2(-this.y, this.x);
    }

    /**
     * Returns the Euclidean distance between this vector and another vector
     * @param {Vec2} vec
     * @returns {number}
     */
    distanceTo(vec) {
        const dx = this.x - vec.x;
        const dy = this.y - vec.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Transformations
    rotate(angle, point = null) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        if (point) {
            const translated = this.sub(point);
            return new Vec2(
                translated.x * cos - translated.y * sin,
                translated.x * sin + translated.y * cos
            ).add(point);
        } else {
            return new Vec2(
                this.x * cos - this.y * sin,
                this.x * sin + this.y * cos
            );
        }
    }

    translate(offset) {
        this.x += offset.x;
        this.y += offset.y;
        return this;
    }
}