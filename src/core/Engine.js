
export class Engine {
    constructor() {
        this.bodies = [];
        this.gravity = 50
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