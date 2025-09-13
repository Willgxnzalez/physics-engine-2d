import { Body } from '../body/Body.js';
import { Vec2 } from '../geometry/Vec2.js';

export class Shapes {
    static Rect(x, y, width, height, options = {}) {
        if (width == null || height == null) {
            throw new Error('Rectangle requires width and height');
        }

        const hw = width / 2;
        const hh = height / 2;

        const verts = [
            new Vec2(-hw, -hh),
            new Vec2(hw, -hh),
            new Vec2(hw, hh),
            new Vec2(-hw, hh)
        ];

        return new Body({
            ...options,
            position: new Vec2(x, y),
            vertices: verts,
            width,
            height
        });
    }

    static Circle(x, y, radius, options = {}) {
        if (radius == null || typeof(radius) !== 'number') {
            throw new Error('Circle requires a valid radius');
        }
    
        return new Body({
            ...options,
            position: new Vec2(x, y),
            vertices: [],
            type: 'circle',
            radius
        });
    }

    static Triangle(x, y, size, options = {}) {
        if (size == null) {
            throw new Error('Triangle requires a size');
        }
    
        const h = size * Math.sqrt(3) / 2; // Height of equilateral triangle
        const centroidOffset = h / 3; // Distance from base to centroid
    
        // Vertices centered around (0,0) as centroid, CCW order
        const verts = [
            new Vec2(-size / 2, -centroidOffset),      // Bottom-left
            new Vec2(size / 2, -centroidOffset),       // Bottom-right
            new Vec2(0, h - centroidOffset)            // Top
        ];
    
        return new Body({
            ...options,
            position: new Vec2(x, y),
            vertices: verts,
        });
    }
}
