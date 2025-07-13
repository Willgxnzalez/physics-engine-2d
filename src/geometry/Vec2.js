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

    scale(scalar) {
        return new Vec2(this.x * scalar, this.y * scalar);
    }

    clone() {
        return new Vec2(this.x, this.y);
    }
}