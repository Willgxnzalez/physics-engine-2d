/**
 * Represents a 2D vector with x and y components.
 */
export class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // Core operations
    set(x, y) { this.x = x; this.y = y; return this; } 
    clone() { return new Vec2(this.x, this.y); }

    // Arithmetic operations
    add(vec) { return new Vec2(this.x + vec.x, this.y + vec.y); }
    sub(vec) { return new Vec2(this.x - vec.x, this.y - vec.y); }
    scale(scalar) { return new Vec2(this.x * scalar, this.y * scalar); }

    // Mutating versions for hot loops
    addEq(vec) { this.x += vec.x; this.y += vec.y; return this; }
    subEq(vec) { this.x -= vec.x; this.y -= vec.y; return this; }
    scaleEq(scalar) { this.x *= scalar; this.y *= scalar; return this; }
    translateEq(vec) { this.x += vec.x; this.y += vec.y; return this; }

    negate() { return new Vec2(-this.x, -this.y); }

    // Geometric operations
    dot(vec) { return this.x * vec.x + this.y * vec.y; }
    cross(vec) { return this.x * vec.y - this.y * vec.x; } // 2D cross product
    mag() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    magSqr() { return this.x * this.x + this.y * this.y; }
    
    normalize() {
        const mag = this.mag();
        if (mag === 0) return this;
        this.x /= mag;
        this.y /= mag;
        return this;
    }

    normalized() {
        const mag = this.mag();
        return mag === 0 ? new Vec2(0, 0) : new Vec2(this.x / mag, this.y / mag);
    }

    perp() { return new Vec2(-this.y, this.x); }

    distanceTo(vec) {
        const dx = this.x - vec.x;
        const dy = this.y - vec.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vec2(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }
}