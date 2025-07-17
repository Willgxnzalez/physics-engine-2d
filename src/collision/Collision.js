import { Vec2 } from '../geometry/Vec2.js';
import { Manifold } from './Manifold.js';

export class Collision {
    static PolygonVsPolygon(A, B) {
        let overlap = Infinity;
        let minAxis = null;
        let minAxisIndex = null;

        const axes = [...A.vertices.normals(), ...B.vertices.normals()];

        for (let i = 0; i < axes.length; i++) {
            const axis = axes[i];
            const projA = A.vertices.project(axis);
            const projB = B.vertices.project(axis);

            const o = Math.min(projA.max, projB.max) - Math.max(projA.min, projB.min);
            if (o <= 0) {
                return null; // No collision
            }

            if (o < overlap) {
                overlap = o;
                minAxis = axis;
                minAxisIndex = i;
                const direction = B.position.sub(A.position);
                if (minAxis.dot(direction) < 0) {
                    minAxis = minAxis.negate();
                }
            }
        }

        const referenceBody = minAxisIndex < A.vertices.length ? A : B;
        const incidentBody = minAxisIndex < A.vertices.length ? B : A;


        const manifold = new Manifold(A, B);
        manifold.normal = minAxis;
        manifold.penetration = overlap;
        manifold.contacts = [A.position, B.position];

        return manifold;
    }
}
