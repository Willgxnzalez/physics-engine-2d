import { Vec2 } from '../geometry/Vec2.js';
import { Manifold } from './Manifold.js';

export class Collision {
    static PolygonVsPolygon(A, B) {
        let overlap = Infinity;
        let minAxis = null;
        let minAxisIndex = null;
        
        const manifold = new Manifold(A, B);
        const axes = [...A.vertices.normals(), ...B.vertices.normals()];

        for (let i = 0; i < axes.length; i++) {
            const axis = axes[i];
            const projA = A.vertices.project(axis);
            const projB = B.vertices.project(axis);

        
            const o = Math.min(projA.max, projB.max) - Math.max(projA.min, projB.min);
            if (o <= 0) {
                return manifold; // No collision
            }

            if (o < overlap) { // Finding the minimum translation vector
                overlap = o;
                minAxis = axis;
                minAxisIndex = i;
                const direction = B.position.sub(A.position);
                if (minAxis.dot(direction) < 0) {
                    minAxis = minAxis.negate();
                }
            }
        }
        // Collision detected

        // Get the reference and incident bodies
        const referenceBody = minAxisIndex < A.vertices.length ? A : B;
        const incidentBody = minAxisIndex < A.vertices.length ? B : A;

        manifold.normal = minAxis;
        manifold.penetration = overlap;
        manifold.contacts = this.findContactPoints(referenceBody.vertices, incidentBody.vertices);

        return manifold;
    }

    /**
     * Sutherland-Hodgman clipping algorithm to find contact points
     * @param {Vertices} referenceVertices - Vertices of the reference polygon
     * @param {Vertices} incidentVertices - Vertices of the incident polygon
     * @returns {Array<Vec2>} Contact points between the polygons
     */
    static findContactPoints(referenceVertices, incidentVertices) {
        let outputVertices = incidentVertices.points;

        let referenceNormals = referenceVertices.normals();

        for (let i = 0; i < referenceVertices.length; i++) {
            const currentVertex = referenceVertices.at(i);
            
            outputVertices = this.clipAgainstEdge(outputVertices, currentVertex, referenceNormals[i]);
            
            if (outputVertices.length === 0) {
                break;  
            }
        }
        
        return outputVertices;
    }

    /**
     * Clip a polygon against a single edge
     * @param {Array<Vec2>} vertices - Vertices to clip
     * @param {Vec2} edgePoint - A point on the clipping edge
     * @param {Vec2} edgeNormal - Normal of the clipping edge (pointing outward)
     * @returns {Array<Vec2>} Clipped verticesw
     */
    static clipAgainstEdge(vertices, edgePoint, edgeNormal) {
        const output = [];
        
        for (let i = 0; i < vertices.length; i++) {
            const currentVertex = vertices[i];
            const previousVertex = vertices[(i - 1 + vertices.length) % vertices.length];
            
            // Calculate signed distance from edge
            const currentDistance = edgeNormal.dot(currentVertex.sub(edgePoint));
            const previousDistance = edgeNormal.dot(previousVertex.sub(edgePoint));
            
            const inside = d => d <= 0;

            if (inside(currentDistance)) {
                if (!inside(previousDistance)) {
                    const intersection = this.lineIntersection(
                        previousVertex,
                        currentVertex,
                        edgePoint,
                        edgePoint.add(edgeNormal.perpendicular())
                    );
                    if (intersection) output.push(intersection);
                }
                output.push(currentVertex);
            } else if (inside(previousDistance)) {
                const intersection = this.lineIntersection(
                    previousVertex,
                    currentVertex,
                    edgePoint,
                    edgePoint.add(edgeNormal.perpendicular())
                );
                if (intersection) output.push(intersection);
            }
        }
        
        return output;
    }

    /**
     * Find intersection point between two line segments
     * @param {Vec2} p1 - Start of first line
     * @param {Vec2} p2 - End of first line
     * @param {Vec2} p3 - Start of second line
     * @param {Vec2} p4 - End of second line
     * @returns {Vec2|null} Intersection point or null if no intersection
     */
    static lineIntersection(p1, p2, p3, p4) {
        const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
        
        if (Math.abs(denom) < 1e-10) {
            return null; // Lines are parallel
        }
        
        const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
        const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
        
        // Check if intersection is within both line segments
        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
            return new Vec2(
                p1.x + ua * (p2.x - p1.x),
                p1.y + ua * (p2.y - p1.y)
            );
        }
        
        return null;
    }
}
