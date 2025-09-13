import { Vec2 } from '../geometry/Vec2.js';
import { Manifold } from './Manifold.js';

export class Collision {
    static CircleVsCircle(A, B) {
        const diff = B.position.sub(A.position);
        const dist = diff.mag();
        const sumR = A.radius + B.radius;
        if (dist >= sumR) return new Manifold(A, B);
    
        const normal = dist > 0 ? diff.normalize() : new Vec2(1, 0); // Arbitrary normal if centers coincide
        const pen = sumR - dist;
        const point = A.position.add(normal.scale(A.radius - pen / 2));
    
        const manifold = new Manifold(A, B);
        manifold.normal = normal;
        manifold.penetration = pen;
        manifold.contacts = [point];
        return manifold;
    }
    
    static CircleVsPolygon(circle, poly, swap = false) {
        // Find closest point on polygon to circle center
        let minDist = Infinity;
        let closest = null;
    
        for (let i = 0; i < poly.vertices.length; i++) {
            const start = poly.vertices.at(i);
            const end = poly.vertices.at((i + 1) % poly.vertices.length);
            const proj = this.projectPointToSegment(circle.position, start, end);
            const d = proj.distanceTo(circle.position);
            if (d < minDist) {
                minDist = d;
                closest = proj;
            }
        }
    
        if (minDist >= circle.radius) return new Manifold(swap ? circle : poly, swap ? poly : circle);
    
        const diff = circle.position.sub(closest);
        let normal = minDist > 0 ? diff.normalize() : new Vec2(1, 0);
        const pen = circle.radius - minDist;
        const point = closest; // Contact on polygon edge
    
        // If swap, normal points from circle (reference) to poly (incident)
        if (swap) {
            normal = normal.negate();
        }
    
        const manifold = new Manifold(swap ? circle : poly, swap ? poly : circle);
        manifold.normal = normal;
        manifold.penetration = pen;
        manifold.contacts = [point];
        return manifold;
    }
    
    static projectPointToSegment(point, a, b) {
        const ab = b.sub(a);
        const ap = point.sub(a);
        const t = ap.dot(ab) / ab.magSq();
        if (t <= 0) return a.clone();
        if (t >= 1) return b.clone();
        return a.add(ab.scale(t));
    }

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
        const edgeNormals = referenceVertices.normals();

        // Clip against each edge of the reference polygon
        for (let i = 0; i < referenceVertices.length; i++) {
            const edgeStart = referenceVertices.at(i);
            const edgeEnd = referenceVertices.at((i + 1) % referenceVertices.length);
            const edgeNormal = edgeNormals[i];
            
            outputVertices = this.clipAgainstEdge(outputVertices, edgeStart, edgeEnd, edgeNormal);
            
            if (outputVertices.length === 0) break;  
        }
        
        return outputVertices;
    }

    /**
     * Clip a polygon against a single edge
     * @param {Array<Vec2>} vertices - Vertices to clip
     * @param {Vec2} edgeStart - Start point of the clipping edge
     * @param {Vec2} edgeEnd - End point of the clipping edge
     * @param {Vec2} edgeNormal - Normal of the clipping edge (pointing inward to the polygon)
     * @returns {Array<Vec2>} Clipped vertices
     */
    static clipAgainstEdge(vertices, edgeStart, edgeEnd, edgeNormal) {
        if (vertices.length === 0) return [];

        const output = [];

        for (let i = 0; i < vertices.length; i++) {
            const currentVertex = vertices[i];
            const previousVertex = vertices[(i - 1 + vertices.length) % vertices.length];

            const currentDistance = edgeNormal.dot(currentVertex.sub(edgeStart));
            const previousDistance = edgeNormal.dot(previousVertex.sub(edgeStart));

            const isCurrentInside = currentDistance <= 0;
            const isPreviousInside = previousDistance <= 0;

            if (isCurrentInside) {
                if (!isPreviousInside) {
                    const intersection = this.lineIntersection(
                        previousVertex,
                        currentVertex,
                        edgeStart,
                        edgeEnd
                    );
                    if (intersection) output.push(intersection);
                }
                output.push(currentVertex);
            } else if (isPreviousInside) {
                const intersection = this.lineIntersection(
                    previousVertex,
                    currentVertex,
                    edgeStart,
                    edgeEnd
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
        
        if (Math.abs(denom) < 1e-10) return null; // Lines are parallel
        
        const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
        
        // For clipping, we want the intersection point along the infinite lines
        // The clipping edge is finite, but the polygon edge being clipped can extend beyond
        return new Vec2(
            p1.x + ua * (p2.x - p1.x),
            p1.y + ua * (p2.y - p1.y)
        );
    }
}