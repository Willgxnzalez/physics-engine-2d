/**
 * A high-level collision interface that calls broad/narrow phase algorithms
 */

import { Collision } from './Collision.js';

export class Detector {
    constructor() {
        // Pre-compute collision dispatch table for O(1) lookup
        this.collisionTable = new Map([
            ['circle-circle', Collision.CircleVsCircle],
            ['circle-polygon', (a, b) => Collision.CircleVsPolygon(a, b, false)],
            ['circle-rectangle', (a, b) => Collision.CircleVsPolygon(a, b, false)], 
            ['circle-triangle', (a, b) => Collision.CircleVsPolygon(a, b, false)],
            ['polygon-circle', (a, b) => Collision.CircleVsPolygon(a, b, true)],
            ['rectangle-circle', (a, b) => Collision.CircleVsPolygon(a, b, true)],
            ['triangle-circle', (a, b) => Collision.CircleVsPolygon(a, b, true)],
            ['polygon-polygon', Collision.PolygonVsPolygon],
            ['rectangle-rectangle', Collision.PolygonVsPolygon],
            ['triangle-triangle', Collision.PolygonVsPolygon],
            ['polygon-rectangle', Collision.PolygonVsPolygon],
            ['polygon-triangle', Collision.PolygonVsPolygon],
            ['rectangle-triangle', Collision.PolygonVsPolygon]
        ]);
    }

    detect(bodies) {
        const manifolds = [];

        for (let i = 0; i < bodies.length; i++) {
            const bodyA = bodies[i];
            // Skip static bodies entirely if they can't move
            if (bodyA.isStatic) continue;

            for (let j = 0; j < bodies.length; j++) {
                const bodyB = bodies[j];
                if (bodyA.id === bodyB.id) continue;

                // Broad phase: Quick AABB rejection
                if (!this._broadPhaseCheck(bodyA, bodyB)) continue;

                // Narrow phase: Get collision function and execute
                const manifold = this._narrowPhaseCollision(bodyA, bodyB);
                
                if (manifold?.isValid()) {
                    manifolds.push(manifold);
                }
            }
        }
        
        return manifolds;
    }

    _broadPhaseCheck(bodyA, bodyB) {
        if (bodyA.isStatic && bodyB.isStatic) return false;
        
        // AABB overlap test
        const boundsA = bodyA.bounds;
        const boundsB = bodyB.bounds;
        
        return boundsA.overlaps(boundsB);
    }

    _narrowPhaseCollision(bodyA, bodyB) {
        const key = `${bodyA.type}-${bodyB.type}`;
        const collisionFunc = this.collisionTable.get(key);

        if (!collisionFunc) {
            console.warn(`No collision handler for ${key}`);
            return null;
        }
        
        return collisionFunc(bodyA, bodyB);
    }
}
