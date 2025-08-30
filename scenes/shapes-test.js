import { Engine } from '../../src/core/Engine.js';
import { Shapes } from '../../src/factory/Shapes.js';
import { Renderer } from '../../src/render/Renderer.js';
import { Vec2 } from '../../src/geometry/Vec2.js';
import { Detector } from '../../src/collision/Detector.js';

export class ShapesTestDemo {
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

        // Create simple shape examples
        this.createRectangleExamples();
        this.createCircleExamples();
        this.createPolygonExamples();
        this.createRotatingExamples();

        this.engine.setGravityStrength(20);
    }

    createRectangleExamples() {
        // Different sized rectangles
        this.smallRect = Shapes.Rect(100, 100, 30, 30, { mass: 1 });
        this.mediumRect = Shapes.Rect(200, 100, 50, 40, { mass: 1.5 });
        this.largeRect = Shapes.Rect(300, 100, 60, 30, { mass: 2 });

        this.engine.addBody(this.smallRect);
        this.engine.addBody(this.mediumRect);
        this.engine.addBody(this.largeRect);
    }

    createCircleExamples() {
        // Different sized circles
        this.smallCircle = Shapes.Circle(450, 100, 15, { mass: 1 });
        this.mediumCircle = Shapes.Circle(550, 100, 25, { mass: 1.5 });
        this.largeCircle = Shapes.Circle(650, 100, 35, { mass: 2 });

        this.engine.addBody(this.smallCircle);
        this.engine.addBody(this.mediumCircle);
        this.engine.addBody(this.largeCircle);
    }

    createPolygonExamples() {
        // Different polygon shapes
        this.triangle = Shapes.Circle(150, 250, 20, { mass: 1, segments: 3 });
        this.square = Shapes.Circle(250, 250, 20, { mass: 1, segments: 4 });
        this.pentagon = Shapes.Circle(350, 250, 20, { mass: 1, segments: 5 });
        this.hexagon = Shapes.Circle(450, 250, 20, { mass: 1, segments: 6 });

        this.engine.addBody(this.triangle);
        this.engine.addBody(this.square);
        this.engine.addBody(this.pentagon);
        this.engine.addBody(this.hexagon);
    }

    createRotatingExamples() {
        // Rotating shapes
        this.rotatingRect = Shapes.Rect(550, 250, 40, 30, { mass: 1 });
        this.rotatingCircle = Shapes.Circle(650, 250, 20, { mass: 1 });
        this.rotatingPoly = Shapes.Circle(750, 250, 18, { mass: 1, segments: 5 });

        this.rotatingRect.angularVelocity = 2.0;
        this.rotatingCircle.angularVelocity = -1.5;
        this.rotatingPoly.angularVelocity = 3.0;

        this.engine.addBody(this.rotatingRect);
        this.engine.addBody(this.rotatingCircle);
        this.engine.addBody(this.rotatingPoly);
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
        // Reset rectangle examples
        this.smallRect.setPosition(100, 100);
        this.mediumRect.setPosition(200, 100);
        this.largeRect.setPosition(300, 100);
        this.smallRect.velocity.set(0, 0);
        this.mediumRect.velocity.set(0, 0);
        this.largeRect.velocity.set(0, 0);
        this.smallRect.angularVelocity = 0;
        this.mediumRect.angularVelocity = 0;
        this.largeRect.angularVelocity = 0;

        // Reset circle examples
        this.smallCircle.setPosition(450, 100);
        this.mediumCircle.setPosition(550, 100);
        this.largeCircle.setPosition(650, 100);
        this.smallCircle.velocity.set(0, 0);
        this.mediumCircle.velocity.set(0, 0);
        this.largeCircle.velocity.set(0, 0);
        this.smallCircle.angularVelocity = 0;
        this.mediumCircle.angularVelocity = 0;
        this.largeCircle.angularVelocity = 0;

        // Reset polygon examples
        this.triangle.setPosition(150, 250);
        this.square.setPosition(250, 250);
        this.pentagon.setPosition(350, 250);
        this.hexagon.setPosition(450, 250);
        this.triangle.velocity.set(0, 0);
        this.square.velocity.set(0, 0);
        this.pentagon.velocity.set(0, 0);
        this.hexagon.velocity.set(0, 0);
        this.triangle.angularVelocity = 0;
        this.square.angularVelocity = 0;
        this.pentagon.angularVelocity = 0;
        this.hexagon.angularVelocity = 0;

        // Reset rotating examples
        this.rotatingRect.setPosition(550, 250);
        this.rotatingCircle.setPosition(650, 250);
        this.rotatingPoly.setPosition(750, 250);
        this.rotatingRect.velocity.set(0, 0);
        this.rotatingCircle.velocity.set(0, 0);
        this.rotatingPoly.velocity.set(0, 0);
        this.rotatingRect.angularVelocity = 2.0;
        this.rotatingCircle.angularVelocity = -1.5;
        this.rotatingPoly.angularVelocity = 3.0;
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
        
        for (const contact of contacts) {
            // Draw collision normal
            const center = contact.bodyA.position.add(contact.bodyB.position).scaleEq(0.5);
            const normalEnd = center.clone().addEq(contact.normal.scale(20));
            this.ctx.beginPath();
            this.ctx.moveTo(center.x, center.y);
            this.ctx.lineTo(normalEnd.x, normalEnd.y);
            this.ctx.stroke();
        }
    }

    renderInfo() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(10, 10, 400, 140);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Arial';
        
        const lines = [
            'SHAPES TEST DEMO',
            '',
            'Examples:',
            '• Rectangles: Small, Medium, Large',
            '• Circles: Small, Medium, Large',
            '• Polygons: Triangle, Square, Pentagon, Hexagon',
            '• Rotating: Shapes with constant rotation',
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