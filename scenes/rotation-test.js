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
        
        this.setup();
        this.setupControls();
    }

    setup() {
        const WIDTH = this.canvas.width;
        const HEIGHT = this.canvas.height;

        // Ground platform
        this.ground = Shapes.Rect(WIDTH/2, HEIGHT - 20, WIDTH * 0.9, 40, { isStatic: true });
        this.engine.addBody(this.ground);

        // Create simple rotation examples
        this.createOrbitalExample();
        this.createPendulumExample();
        this.createSpinningExample();
        this.createRotatingExample();

        this.engine.setGravityStrength(20);
    }

    createOrbitalExample() {
        // Central pivot
        this.centerPivot = Shapes.Circle(150, 150, 6, { isStatic: true });
        this.engine.addBody(this.centerPivot);

        // Two orbiting bodies
        this.orbit1 = Shapes.Circle(150, 120, 10, { mass: 1 });
        this.orbit2 = Shapes.Circle(200, 150, 8, { mass: 0.8 });

        // Set orbital velocities
        this.orbit1.velocity.set(25, 0);
        this.orbit2.velocity.set(0, 20);

        this.engine.addBody(this.orbit1);
        this.engine.addBody(this.orbit2);
    }

    createPendulumExample() {
        // Pendulum pivot
        this.pendulumPivot = Shapes.Circle(350, 100, 6, { isStatic: true });
        this.engine.addBody(this.pendulumPivot);

        // Pendulum bob - start slightly offset to create swinging motion
        this.pendulum = Shapes.Circle(370, 150, 12, { mass: 1.5 });
        this.pendulum.velocity.set(0, 0);

        this.engine.addBody(this.pendulum);
    }

    createSpinningExample() {
        // Three spinning bodies
        this.spinningRect = Shapes.Rect(550, 150, 30, 20, { mass: 1 });
        this.spinningCircle = Shapes.Circle(650, 150, 15, { mass: 1 });
        this.spinningTriangle = Shapes.Circle(750, 150, 12, { mass: 1, segments: 3 });

        // High spin speeds
        this.spinningRect.angularVelocity = 4.0;
        this.spinningCircle.angularVelocity = -3.0;
        this.spinningTriangle.angularVelocity = 5.0;

        this.engine.addBody(this.spinningRect);
        this.engine.addBody(this.spinningCircle);
        this.engine.addBody(this.spinningTriangle);
    }

    createRotatingExample() {
        // Rotating pivot
        this.rotatingPivot = Shapes.Circle(450, 300, 6, { isStatic: true });
        this.engine.addBody(this.rotatingPivot);

        // Body rotating around pivot
        this.rotatingBody = Shapes.Rect(450, 250, 25, 25, { mass: 1 });
        this.rotatingBody.angularVelocity = 2.0;

        this.engine.addBody(this.rotatingBody);
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
                this.resetDemo();
                console.log('Demo reset');
            }
        });
    }

    resetDemo() {
        // Reset orbital example
        this.orbit1.setPosition(150, 120);
        this.orbit2.setPosition(200, 150);
        this.orbit1.velocity.set(25, 0);
        this.orbit2.velocity.set(0, 20);
        this.orbit1.angularVelocity = 0;
        this.orbit2.angularVelocity = 0;

        // Reset pendulum example
        this.pendulum.setPosition(370, 150);
        this.pendulum.velocity.set(0, 0);
        this.pendulum.angularVelocity = 0;

        // Reset spinning example
        this.spinningRect.setPosition(550, 150);
        this.spinningCircle.setPosition(650, 150);
        this.spinningTriangle.setPosition(750, 150);
        this.spinningRect.velocity.set(0, 0);
        this.spinningCircle.velocity.set(0, 0);
        this.spinningTriangle.velocity.set(0, 0);
        this.spinningRect.angularVelocity = 4.0;
        this.spinningCircle.angularVelocity = -3.0;
        this.spinningTriangle.angularVelocity = 5.0;

        // Reset rotating example
        this.rotatingBody.setPosition(450, 250);
        this.rotatingBody.velocity.set(0, 0);
        this.rotatingBody.angularVelocity = 2.0;
    }

    update() {
        if (!this.isPaused) {
            this.engine.update(1 / 60);
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const contacts = Detector.findCollisions(this.engine.bodies);
        Renderer.render(this.ctx, this.engine.bodies, this.debugMode);
        
        if (this.debugMode) {
            this.renderDebugInfo(contacts);
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
            const normalEnd = center.add(contact.normal.scale(20));
            this.ctx.beginPath();
            this.ctx.moveTo(center.x, center.y);
            this.ctx.lineTo(normalEnd.x, normalEnd.y);
            this.ctx.stroke();
        }
    }

    drawPivotConnections() {
        this.ctx.strokeStyle = '#ff00ff';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);

        // Draw connections to pivots
        const pivotConnections = [
            [this.centerPivot, [this.orbit1, this.orbit2]],
            [this.pendulumPivot, [this.pendulum]],
            [this.rotatingPivot, [this.rotatingBody]]
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

    renderInfo() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(10, 10, 400, 140);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Arial';
        
        const lines = [
            'ROTATION TEST DEMO',
            '',
            'Examples:',
            '• Orbital Motion: Bodies orbiting around central pivot',
            '• Pendulum Motion: Swinging pendulum bob',
            '• Spinning Bodies: High-speed rotation demonstration',
            '• Rotating Body: Body rotating around pivot point',
            '',
            'Controls:',
            'SPACE: Pause/Resume',
            'D: Toggle Debug Mode',
            'R: Reset Demo'
        ];
        
        lines.forEach((line, index) => {
            this.ctx.fillText(line, 15, 30 + index * 15);
        });
    }

    renderPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 160, 300, 30);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('PAUSED - Press SPACE to resume', 15, 180);
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