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
        this.ground = Shapes.Rect(WIDTH/2, HEIGHT - 30, WIDTH * 0.8, 40, { isStatic: true });
        this.engine.addBody(this.ground);

        // Test different shapes
        this.createRectangleTests();
        this.createCircleTests();
        this.createPolygonTests();
        this.createMixedShapes();

        this.engine.setGravityStrength(30);
    }

    createRectangleTests() {
        // Spread rectangles horizontally, smaller sizes
        this.smallRect = Shapes.Rect(80, 70, 30, 30, { mass: 1 });
        this.mediumRect = Shapes.Rect(150, 70, 40, 40, { mass: 2 });
        this.largeRect = Shapes.Rect(230, 70, 60, 30, { mass: 3 });
        this.tallRect = Shapes.Rect(310, 70, 25, 60, { mass: 2 });

        this.engine.addBody(this.smallRect);
        this.engine.addBody(this.mediumRect);
        this.engine.addBody(this.largeRect);
        this.engine.addBody(this.tallRect);
    }

    createCircleTests() {
        // Spread circles horizontally, smaller radii
        this.smallCircle = Shapes.Circle(400, 70, 18, { mass: 1 });
        this.mediumCircle = Shapes.Circle(470, 70, 28, { mass: 2 });
        this.largeCircle = Shapes.Circle(540, 70, 36, { mass: 3 });
        this.highSegments = Shapes.Circle(570, 140, 22, { mass: 1, segments: 32 });

        this.engine.addBody(this.smallCircle);
        this.engine.addBody(this.mediumCircle);
        this.engine.addBody(this.largeCircle);
        this.engine.addBody(this.highSegments);
    }

    createPolygonTests() {
        // Spread polygons horizontally, smaller radii
        this.triangle = Shapes.Circle(80, 200, 28, { mass: 1, segments: 3 });
        this.square = Shapes.Circle(150, 200, 28, { mass: 1, segments: 4 });
        this.pentagon = Shapes.Circle(220, 200, 28, { mass: 1, segments: 5 });
        this.hexagon = Shapes.Circle(290, 200, 28, { mass: 1, segments: 6 });
        this.octagon = Shapes.Circle(360, 200, 28, { mass: 1, segments: 8 });

        this.engine.addBody(this.triangle);
        this.engine.addBody(this.square);
        this.engine.addBody(this.pentagon);
        this.engine.addBody(this.hexagon);
        this.engine.addBody(this.octagon);
    }

    createMixedShapes() {
        // Mixed shapes, spaced out
        this.mixedRect = Shapes.Rect(440, 200, 40, 40, { mass: 2 });
        this.mixedCircle = Shapes.Circle(510, 200, 24, { mass: 2 });
        this.mixedPoly = Shapes.Circle(580, 200, 28, { mass: 2, segments: 7 });

        this.mixedRect.angularVelocity = 2;
        this.mixedCircle.angularVelocity = -1;
        this.mixedPoly.angularVelocity = 1.5;

        this.engine.addBody(this.mixedRect);
        this.engine.addBody(this.mixedCircle);
        this.engine.addBody(this.mixedPoly);
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
                this.resetShapes();
                console.log('Shapes reset');
            }
        });
    }

    resetShapes() {
        // Reset all shapes to their original positions
        const shapes = [
            this.smallRect, this.mediumRect, this.largeRect, this.tallRect,
            this.smallCircle, this.mediumCircle, this.largeCircle, this.highSegments,
            this.triangle, this.square, this.pentagon, this.hexagon, this.octagon,
            this.mixedRect, this.mixedCircle, this.mixedPoly
        ];

        const originalPositions = [
            [80, 70], [150, 70], [230, 70], [310, 70],
            [400, 70], [470, 70], [540, 70], [570, 140],
            [80, 200], [150, 200], [220, 200], [290, 200], [360, 200],
            [440, 200], [510, 200], [580, 200]
        ];

        shapes.forEach((shape, index) => {
            const [x, y] = originalPositions[index];
            shape.setPosition(x, y);
            shape.setAngle(0);
            shape.velocity.set(0, 0);
            shape.angularVelocity = 0;
        });

        // Restore rotations for mixed shapes
        this.mixedRect.angularVelocity = 2;
        this.mixedCircle.angularVelocity = -1;
        this.mixedPoly.angularVelocity = 1.5;
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
            const center = contact.bodyA.position.add(contact.bodyB.position).scale(0.5);
            const normalEnd = center.add(contact.normal.scale(30));
            this.ctx.beginPath();
            this.ctx.moveTo(center.x, center.y);
            this.ctx.lineTo(normalEnd.x, normalEnd.y);
            this.ctx.stroke();
            
            // Draw contact points
            for (const contactPoint of contact.contacts) {
                this.ctx.beginPath();
                this.ctx.arc(contactPoint.x, contactPoint.y, 4, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
    }

    renderInfo() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(10, 10, 300, 120);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Arial';
        
        const lines = [
            'SHAPES TEST DEMO',
            'Rectangles: Small, Medium, Large, Tall',
            'Circles: Small, Medium, Large, High-res',
            'Polygons: Triangle, Square, Pentagon, Hex, Octagon',
            'Mixed: Rotating shapes with different types',
            '',
            'Controls:',
            'SPACE: Pause/Resume  D: Debug  R: Reset'
        ];
        
        lines.forEach((line, index) => {
            this.ctx.fillText(line, 15, 30 + index * 15);
        });
    }

    renderPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 140, 300, 30);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('PAUSED - Press SPACE to resume', 15, 160);
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