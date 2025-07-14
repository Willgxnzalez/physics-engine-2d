
export class Engine {
    constructor() {
        this.bodies = [];
        this.gravity = 300; // Gravity acceleration in pixels per second squared
    }

    addBody(body) {
        this.bodies.push(body);
    }

    update(dt) {
        for (const body of this.bodies) {
            body.update(dt, this.gravity);
        }
    }
}