/**
 * Represents a 2D vector with x and y components.
 *
 * @class Vec2
 */
export class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vec) {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }

    sub(vec) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }

    mult(vec) {
        return new Vec2(this.x * vec.x, this.y * vec.y);
    }

    div(vec) {
        if (vec.x === 0 || vec.y === 0) {
            throw new Error("Division by zero is not allowed.");
        }
        return new Vec2(this.x / vec.x, this.y / vec.y);
    }
    
    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const mag = this.magnitude();
        if (mag === 0) {
            throw new Error("Cannot normalize a zero vector.");
        }
        return new Vec2(this.x / mag, this.y / mag);
    }

    scale(scalar) {
        return new Vec2(this.x * scalar, this.y * scalar);
    }

    translate(offset) {
        this.x += offset.x;
        this.y += offset.y;
        return this; // method chaining
    }   

    clone() {
        return new Vec2(this.x, this.y);
    }
}