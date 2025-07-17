/**
 * A high-level collision interface that calls broad/narrow phase algorithms
 */

import { Collision } from './Collision.js';

export class Detector {
    static findCollisions(bodies) {
        const contacts = [];

        for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
                const bodyA = bodies[i];
                const bodyB = bodies[j];

                if (!bodyA.bounds || !bodyB.bounds) continue;

                // Broad phase: AABB overlap test
                if (!bodyA.bounds.overlaps(bodyB.bounds)) continue;

                // Narrow phase: SAT collision detection
                const manifold = Collision.PolygonVsPolygon(bodyA, bodyB);
                if (manifold.isValid()) {
                    contacts.push(manifold);
                }
            }
        }
        return contacts;
    }
}
