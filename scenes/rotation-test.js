import { Engine } from '../../src/core/Engine.js';
import { Shapes } from '../../src/factory/Shapes.js';
import { Renderer } from '../../src/render/Renderer.js';
import { Vec2 } from '../../src/geometry/Vec2.js';
import { Detector } from '../../src/collision/Detector.js';

export class RotationTestDemo {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.engine = new Engine();
        this.isPaused = false;
        this.debugMode = true;
        this.time = 0;
        
        this.setup();
        this.setupControls();
    }

    setup() {
        const WIDTH = this.canvas.width;
        const HEIGHT = this.canvas.height;

        // Ground platform
        this.ground = Shapes.Rect(WIDTH/2, HEIGHT - 30, WIDTH * 0.8, 40, { isStatic: true });
        this.engine.addBody(this.ground);

        // Create different rotation test scenarios
        this.createOrbitalMotion();
        this.createPendulumMotion();
        this.createRotatingAroundPivot();
        this.createSpinningBodies();
        this.createRotationWithConstraints();

        this.engine.setGravityStrength(30);
    }

    createOrbitalMotion() {
        // Central pivot point
        this.centerPivot = Shapes.Circle(200, 200, 8, { isStatic: true, mass: 0 });
        this.engine.addBody(this.centerPivot);

        // Orbiting bodies at different distances
        this.orbit1 = Shapes.Circle(200, 150, 12, { mass: 1 });
        this.orbit2 = Shapes.Circle(200, 100, 10, { mass: 0.8 });
        this.orbit3 = Shapes.Circle(250, 200, 8, { mass: 0.6 });

        // Set initial velocities for orbital motion
        this.orbit1.velocity.set(30, 0);
        this.orbit2.velocity.set(25, 0);
        this.orbit3.velocity.set(0, 20);

        this.engine.addBody(this.orbit1);
        this.engine.addBody(this.orbit2);
        this.engine.addBody(this.orbit3);
    }

    createPendulumMotion() {
        // Pendulum pivot
        this.pendulumPivot = Shapes.Circle(400, 100, 6, { isStatic: true });
        this.engine.addBody(this.pendulumPivot);

        // Pendulum bobs
        this.pendulum1 = Shapes.Circle(400, 150, 15, { mass: 2 });
        this.pendulum2 = Shapes.Circle(400, 200, 12, { mass: 1.5 });
        this.pendulum3 = Shapes.Circle(400, 250, 10, { mass: 1 });

        // Set initial angular velocities for pendulum motion
        this.pendulum1.angularVelocity = 0.5;
        this.pendulum2.angularVelocity = -0.3;
        this.pendulum3.angularVelocity = 0.7;

        this.engine.addBody(this.pendulum1);
        this.engine.addBody(this.pendulum2);
        this.engine.addBody(this.pendulum3);
    }

    createRotatingAroundPivot() {
        // Pivot point
        this.rotatingPivot = Shapes.Circle(600, 200, 8, { isStatic: true });
        this.engine.addBody(this.rotatingPivot);

        // Bodies that rotate around the pivot
        this.rotatingRect = Shapes.Rect(600, 150, 30, 20, { mass: 1 });
        this.rotatingCircle = Shapes.Circle(650, 200, 12, { mass: 0.8 });
        this.rotatingPoly = Shapes.Circle(600, 250, 15, { mass: 1.2, segments: 6 });

        // Set angular velocities for rotation
        this.rotatingRect.angularVelocity = 1.2;
        this.rotatingCircle.angularVelocity = -0.8;
        this.rotatingPoly.angularVelocity = 0.6;

        this.engine.addBody(this.rotatingRect);
        this.engine.addBody(this.rotatingCircle);
        this.engine.addBody(this.rotatingPoly);
    }

    createSpinningBodies() {
        // Bodies with different spin characteristics
        this.spinningRect = Shapes.Rect(100, 350, 40, 30, { mass: 2 });
        this.spinningCircle = Shapes.Circle(200, 350, 20, { mass: 1.5 });
        this.spinningTriangle = Shapes.Circle(300, 350, 18, { mass: 1, segments: 3 });

        // High angular velocities for spinning effect
        this.spinningRect.angularVelocity = 3.0;
        this.spinningCircle.angularVelocity = -2.5;
        this.spinningTriangle.angularVelocity = 4.0;

        this.engine.addBody(this.spinningRect);
        this.engine.addBody(this.spinningCircle);
        this.engine.addBody(this.spinningTriangle);
    }

    createRotationWithConstraints() {
        // Constraint pivot
        this.constraintPivot = Shapes.Circle(500, 350, 6, { isStatic: true });
        this.engine.addBody(this.constraintPivot);

        // Constrained bodies
        this.constrainedRect = Shapes.Rect(500, 320, 25, 25, { mass: 1 });
        this.constrainedCircle = Shapes.Circle(530, 350, 15, { mass: 0.8 });

        // Apply forces to create constrained rotation
        this.constrainedRect.applyForceAtPoint(new Vec2(5, 0), this.constrainedRect.position);
        this.constrainedCircle.applyForceAtPoint(new Vec2(-3, 2), this.constrainedCircle.position);

        this.engine.addBody(this.constrainedRect);
        this.engine.addBody(this.constrainedCircle);
    }

    setupControls() {
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                this.isPaused = !this.isPaused;
                console.log(this.isPaused ? 'Paused' : 'Resumed');
            }
            if (event.code === 'KeyD') {
                this.debugMode = !this.debugMode;
                console.log(this.debugMode ? 'Debug ON' : 'Debug OFF');
            }
            if (event.code === 'KeyR') {
                this.resetRotation();
                console.log('Rotation reset');
            }
            if (event.code === 'KeyT') {
                this.toggleRotationSpeeds();
                console.log('Rotation speeds toggled');
            }
        });
    }

    resetRotation() {
        // Reset orbital motion
        this.orbit1.setPosition(200, 150);
        this.orbit2.setPosition(200, 100);
        this.orbit3.setPosition(250, 200);
        this.orbit1.velocity.set(30, 0);
        this.orbit2.velocity.set(25, 0);
        this.orbit3.velocity.set(0, 20);

        // Reset pendulum motion
        this.pendulum1.setPosition(400, 150);
        this.pendulum2.setPosition(400, 200);
        this.pendulum3.setPosition(400, 250);
        this.pendulum1.angularVelocity = 0.5;
        this.pendulum2.angularVelocity = -0.3;
        this.pendulum3.angularVelocity = 0.7;

        // Reset rotating bodies
        this.rotatingRect.setPosition(600, 150);
        this.rotatingCircle.setPosition(650, 200);
        this.rotatingPoly.setPosition(600, 250);
        this.rotatingRect.angularVelocity = 1.2;
        this.rotatingCircle.angularVelocity = -0.8;
        this.rotatingPoly.angularVelocity = 0.6;

        // Reset spinning bodies
        this.spinningRect.setPosition(100, 350);
        this.spinningCircle.setPosition(200, 350);
        this.spinningTriangle.setPosition(300, 350);
        this.spinningRect.angularVelocity = 3.0;
        this.spinningCircle.angularVelocity = -2.5;
        this.spinningTriangle.angularVelocity = 4.0;

        // Reset constrained bodies
        this.constrainedRect.setPosition(500, 320);
        this.constrainedCircle.setPosition(530, 350);
        this.constrainedRect.velocity.set(0, 0);
        this.constrainedCircle.velocity.set(0, 0);
    }

    toggleRotationSpeeds() {
        // Toggle between normal and high rotation speeds
        const bodies = [
            this.orbit1, this.orbit2, this.orbit3,
            this.pendulum1, this.pendulum2, this.pendulum3,
            this.rotatingRect, this.rotatingCircle, this.rotatingPoly,
            this.spinningRect, this.spinningCircle, this.spinningTriangle
        ];

        bodies.forEach(body => {
            if (Math.abs(body.angularVelocity) > 0) {
                body.angularVelocity *= 2;
            }
        });
    }

    update() {
        if (!this.isPaused) {
            this.time += 1/60;
            this.engine.update(1 / 60);
            
            // Apply periodic forces for some bodies
            this.applyPeriodicForces();
        }
    }

    applyPeriodicForces() {
        // Apply periodic forces to create more interesting rotation patterns
        const frequency = 2.0;
        const amplitude = 10;
        
        // Apply forces to constrained bodies
        this.constrainedRect.applyForceAtPoint(
            new Vec2(amplitude * Math.sin(this.time * frequency), 0),
            this.constrainedRect.position
        );
        
        this.constrainedCircle.applyForceAtPoint(
            new Vec2(0, amplitude * Math.cos(this.time * frequency * 0.7)),
            this.constrainedCircle.position
        );
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const contacts = Detector.findCollisions(this.engine.bodies);
        Renderer.render(this.ctx, this.engine.bodies, this.debugMode);
        
        if (this.debugMode) {
            this.renderDebugInfo(contacts);
            this.renderRotationInfo();
        }
        
        this.renderInfo();
        
        if (this.isPaused) {
            this.renderPauseOverlay();
        }
    }

    renderDebugInfo(contacts) {
        this.ctx.fillStyle = '#ffff00';
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        
        // Draw pivot connections
        this.drawPivotConnections();
        
        // Draw collision info
        for (const contact of contacts) {
            const center = contact.bodyA.position.add(contact.bodyB.position).scale(0.5);
            const normalEnd = center.add(contact.normal.scale(30));
            this.ctx.beginPath();
            this.ctx.moveTo(center.x, center.y);
            this.ctx.lineTo(normalEnd.x, normalEnd.y);
            this.ctx.stroke();
            
            for (const contactPoint of contact.contacts) {
                this.ctx.beginPath();
                this.ctx.arc(contactPoint.x, contactPoint.y, 4, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
    }

    drawPivotConnections() {
        this.ctx.strokeStyle = '#ff00ff';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);

        // Draw connections to pivots
        const pivotConnections = [
            [this.centerPivot, [this.orbit1, this.orbit2, this.orbit3]],
            [this.pendulumPivot, [this.pendulum1, this.pendulum2, this.pendulum3]],
            [this.rotatingPivot, [this.rotatingRect, this.rotatingCircle, this.rotatingPoly]],
            [this.constraintPivot, [this.constrainedRect, this.constrainedCircle]]
        ];

        for (const [pivot, bodies] of pivotConnections) {
            for (const body of bodies) {
                this.ctx.beginPath();
                this.ctx.moveTo(pivot.position.x, pivot.position.y);
                this.ctx.lineTo(body.position.x, body.position.y);
                this.ctx.stroke();
            }
        }

        this.ctx.setLineDash([]);
    }

    renderRotationInfo() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(10, 140, 350, 100);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        
        const bodies = [
            { name: 'Orbit1', body: this.orbit1 },
            { name: 'Pendulum1', body: this.pendulum1 },
            { name: 'SpinningRect', body: this.spinningRect },
            { name: 'ConstrainedRect', body: this.constrainedRect }
        ];

        let y = 160;
        bodies.forEach(({ name, body }) => {
            const angularVel = body.angularVelocity.toFixed(2);
            const angle = (body.angle * 180 / Math.PI).toFixed(1);
            this.ctx.fillText(`${name}: ω=${angularVel}rad/s, θ=${angle}°`, 15, y);
            y += 15;
        });
    }

    renderInfo() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(10, 10, 400, 120);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Arial';
        
        const lines = [
            'ROTATION TEST DEMO',
            'Orbital Motion: Bodies orbiting around central pivot',
            'Pendulum Motion: Swinging pendulum bobs',
            'Rotating Bodies: Bodies rotating around pivot points',
            'Spinning Bodies: High-speed rotation demonstration',
            'Constrained Rotation: Bodies with applied forces',
            '',
            'Controls: SPACE: Pause/Resume  D: Debug  R: Reset  T: Toggle Speed'
        ];
        
        lines.forEach((line, index) => {
            this.ctx.fillText(line, 15, 30 + index * 15);
        });
    }

    renderPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 250, 300, 30);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('PAUSED - Press SPACE to resume', 15, 270);
    }

    run() {
        const loop = () => {
            this.update();
            this.render();
            requestAnimationFrame(loop);
        };
        loop();
    }
} 