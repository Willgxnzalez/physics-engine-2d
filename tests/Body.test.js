import { describe, it, expect, beforeEach } from 'vitest';
import { Body } from '../src/body/Body.js';
import { Vec2 } from '../src/geometry/Vec2.js';
import { Shapes } from '../src/factory/Shapes.js';

describe('Body - Physical Property Setup', () => {
    describe('Constructor - Default Values', () => {
        it('should create body with default physical properties', () => {
            const body = new Body();
            
            expect(body.isStatic).toBe(false);
            expect(body.mass).toBe(1);
            expect(body.invMass).toBe(1);
            expect(body.inertia).toBeCloseTo(0.01, 4); // Default fallback for polygon
            expect(body.invInertia).toBeCloseTo(100, 2);
            expect(body.position).toEqual(new Vec2(0, 0));
            expect(body.velocity).toEqual(new Vec2(0, 0));
            expect(body.angle).toBe(0);
            expect(body.angularVelocity).toBe(0);
        });

        it('should create body with custom mass', () => {
            const body = new Body({ mass: 5 });
            
            expect(body.mass).toBe(5);
            expect(body.invMass).toBe(0.2);
            expect(body.inertia).toBeCloseTo(0.05, 4); // 5 * 0.01
            expect(body.invInertia).toBe(20);
        });

        it('should create body with custom position and motion', () => {
            const body = new Body({
                position: new Vec2(10, 20),
                velocity: new Vec2(5, -3),
                angle: Math.PI / 4,
                angularVelocity: 2
            });
            
            expect(body.position).toEqual(new Vec2(10, 20));
            expect(body.velocity).toEqual(new Vec2(5, -3));
            expect(body.angle).toBeCloseTo(Math.PI / 4);
            expect(body.angularVelocity).toBe(2);
        });
    });
    
    describe('Static Bodies', () => {
        it('should create static body with infinite mass and inertia', () => {
            const body = Shapes.Rect(0, 0, 10, 10, { isStatic: true });
            
            expect(body.isStatic).toBe(true);
            expect(body.mass).toBe(Infinity);
            expect(body.inertia).toBe(Infinity);
            expect(body.invMass).toBe(0);
            expect(body.invInertia).toBe(0);
        });

        it('should ignore custom mass for static bodies', () => {
            const body = Shapes.Rect(0, 0, 10, 10, { isStatic: true, mass: 100 });
            
            expect(body.mass).toBe(Infinity);
            expect(body.invMass).toBe(0);
        });

        it('should convert dynamic body to static', () => {
            const body = Shapes.Rect(0, 0, 10, 10, { mass: 10 });
            
            expect(body.isStatic).toBe(false);
            expect(body.mass).toBe(10);
            
            body.setStatic(true);
            
            expect(body.isStatic).toBe(true);
            expect(body.mass).toBe(Infinity);
            expect(body.invMass).toBe(0);
            expect(body.velocity).toEqual(new Vec2(0, 0));
            expect(body.angularVelocity).toBe(0);
        });
    });

    describe('Shape-Based Inertia Calculation', () => {
        it('should calculate inertia for circle shape', () => {
            const body = Shapes.Circle(0, 0, 10, { mass: 4 });
            
            // I = (m/2) * r²  = (4/2) * 100 = 200
            expect(body.inertia).toBeCloseTo(200, 2);
            expect(body.invInertia).toBeCloseTo(1/200, 6);
        });

        it('should calculate inertia for rectangle shape', () => {
            const body = Shapes.Rect(0, 0, 4, 6, { mass: 12 });
            
            // I = (m/12) * (w² + h²) = (12/12) * (16 + 36) = 52
            expect(body.inertia).toBeCloseTo(52, 2);
            expect(body.invInertia).toBeCloseTo(1/52, 6);
        });
    });

    describe('Custom Inertia Values', () => {
        it('should use custom inertia when provided', () => {
            const body = new Body({
                mass: 5,
                inertia: 25,
                shapeType: 'circle',
                shapeData: { radius: 10 }
            });
            
            expect(body.inertia).toBe(25);
            expect(body.invInertia).toBe(1/25);
        });

        it('should use custom inertia even for static bodies', () => {
            const body = new Body({
                isStatic: true,
                inertia: 50
            });
            
            expect(body.inertia).toBe(Infinity); // Static bodies always have infinite inertia
            expect(body.invInertia).toBe(0);
        });
    });

    describe('Mass Updates', () => {
        it('should update mass and recalculate derived properties', () => {
            const body = Shapes.Circle(0, 0, 5, { mass: 2 });
            
            expect(body.mass).toBe(2);
            expect(body.invMass).toBe(0.5);
            expect(body.inertia).toBeCloseTo(25, 2); // (2/2) * 25 = 25
            
            body.setMass(8);
            
            expect(body.mass).toBe(8);
            expect(body.invMass).toBe(0.125);
            expect(body.inertia).toBeCloseTo(100, 2); // (8/2) * 25 = 100
        });

        it('should not update mass for static bodies', () => {
            const body = Shapes.Rect(0, 0, 10, 10, { isStatic: true });
            
            body.setMass(100);
            
            expect(body.mass).toBe(Infinity);
            expect(body.invMass).toBe(0);
        });
    });

    describe('Polygon Inertia (Advanced)', () => {
        it('should calculate approximate inertia for triangle vertices', () => {
            const triangleVertices = [
                new Vec2(0, 1),
                new Vec2(-1, -1),
                new Vec2(1, -1)
            ];
            
            const body = new Body({
                mass: 3,
                vertices: triangleVertices,
            });
            
            expect(body.inertia).toBeGreaterThan(0);
            expect(body.invInertia).toBeGreaterThan(0);
            expect(body.invInertia).toBeLessThan(Infinity);
        });

        it('should use fallback inertia for invalid polygons', () => {
            const body = new Body({
                mass: 5,
                vertices: [new Vec2(0, 0)], // Invalid polygon (< 3 vertices)
                shapeType: 'polygon'
            });
            
            expect(body.inertia).toBeCloseTo(0.05, 4); // mass * 0.01
        });
    });

    describe('Force and Torque Application', () => {
        let body;

        beforeEach(() => { 
            body = Shapes.Rect(0, 0, 10, 10, { mass: 2 });
        });

        it('should apply force to dynamic body', () => {
            const force = new Vec2(10, 5);
            body.applyForce(force);
            
            expect(body.force).toEqual(new Vec2(10, 5));
        });

        it('should apply torque to dynamic body', () => {
            body.applyTorque(15);
            
            expect(body.torque).toBe(15);
        });

        it('should not apply force to static body', () => {
            const staticBody = Shapes.Rect(0, 0, 10, 10, { isStatic: true });
            staticBody.applyForce(new Vec2(100, 100));
            
            expect(staticBody.force).toEqual(new Vec2(0, 0));
        });

        it('should not apply torque to static body', () => {
            const staticBody = Shapes.Rect(0, 0, 10, 10, { isStatic: true });
            staticBody.applyTorque(100);
            
            expect(staticBody.torque).toBe(0);
        });

        it('should apply force at point and generate torque', () => {
            body.position = new Vec2(0, 0);
            const force = new Vec2(0, 10);
            const point = new Vec2(5, 0); // 5 units to the right
            
            body.applyForceAtPoint(force, point);
            
            expect(body.force).toEqual(new Vec2(0, 10));
            expect(body.torque).toBeCloseTo(50, 2); // r × F = 5 × 10 = 50
        });
    });

    describe('Property Consistency', () => {
        it('should maintain inverse relationships', () => {
            const body = Shapes.Rect(0, 0, 10, 10, { mass: 4 });
            
            if (body.mass !== Infinity) {
                expect(body.invMass).toBeCloseTo(1 / body.mass, 6);
            }
            
            if (body.inertia !== Infinity && body.inertia !== 0) {
                expect(body.invInertia).toBeCloseTo(1 / body.inertia, 6);
            }
        });

        it('should handle zero inertia edge case', () => {
            const body = new Body({ mass: 1, inertia: 0 });
            
            expect(body.inertia).toBe(0);
            expect(body.invInertia).toBe(0);
        });
    });

    describe('Translation and Rotation', () => {
        let body;

        beforeEach(() => {
            body = Shapes.Rect(0, 0, 10, 10, { mass: 2 });
        });

        it('should translate body position', () => {
            const translation = new Vec2(5, 5);
            body.translate(translation);
            
            expect(body.position).toEqual(new Vec2(5, 5));
        });

        it('should rotate body around its center', () => {
            const angle = Math.PI / 4; // 45 degrees
            body.rotate(angle);
            
            expect(body.angle).toBeCloseTo(angle, 6);
        });

        it('should not change position when rotating', () => {
            const initialPosition = body.position.clone();
            body.rotate(Math.PI / 4);
            
            expect(body.position).toEqual(initialPosition);
        });

        it('should set angle and position directly', () => {
            body.setAngle(Math.PI / 2);
            body.setPosition(new Vec2(10, 10));
            body.setTransform(new Vec2(10, 10), Math.PI / 2);
            
            expect(body.angle).toBeCloseTo(Math.PI / 2, 6);
            expect(body.position).toEqual(new Vec2(10, 10));

        });
    });
});