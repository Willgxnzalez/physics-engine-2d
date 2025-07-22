import { Engine } from '../../src/core/Engine.js';
import { Shapes } from '../../src/factory/Shapes.js';
import { Renderer } from '../../src/render/Renderer.js';
import { Vec2 } from '../../src/geometry/Vec2.js';
import { Detector } from '../../src/collision/Detector.js';

export class BasicCollisionDemo {
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

        // Create bodies for collision testing
        this.ground = Shapes.Rect(WIDTH/2, HEIGHT - 100, WIDTH, 50, { isStatic: true });
        this.box1 = Shapes.Rect(200, 100, 100, 100, { mass: 1 });
        this.box2 = Shapes.Rect(250, 100, 50, 50, { mass: 1 });
        this.circle = Shapes.Circle(400, 50, 80, { mass: 2 });

        // Stack of three boxes
        this.stackBox1 = Shapes.Rect(600, HEIGHT - 170, 60, 60, { mass: 1 });
        this.stackBox2 = Shapes.Rect(600, HEIGHT - 240, 60, 60, { mass: 1 });
        this.stackBox3 = Shapes.Rect(600, HEIGHT - 310, 60, 60, { mass: 1 });

        // Row of circles
        this.circle1 = Shapes.Circle(100, 300, 30, { mass: 1 });
        this.circle2 = Shapes.Circle(170, 300, 30, { mass: 1 });
        this.circle3 = Shapes.Circle(240, 300, 30, { mass: 1 });

        // Polygon (triangle) colliding with a box
        this.triangle = Shapes.Circle(350, 200, 40, { mass: 1, segments: 3 });
        this.targetBox = Shapes.Rect(350, 350, 80, 40, { mass: 2 });

        this.engine.addBody(this.ground);
        this.engine.addBody(this.box1);
        this.engine.addBody(this.box2);
        this.engine.addBody(this.circle);
        this.engine.addBody(this.stackBox1);
        this.engine.addBody(this.stackBox2);
        this.engine.addBody(this.stackBox3);
        this.engine.addBody(this.circle1);
        this.engine.addBody(this.circle2);
        this.engine.addBody(this.circle3);
        this.engine.addBody(this.triangle);
        this.engine.addBody(this.targetBox);

        this.engine.setGravityStrength(50);
    }

    setupControls() {
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                if (this.engine.isPaused()) {
                    this.engine.resume();
                    console.log('Resumed');
                } else {
                    this.engine.pause();
                    console.log('Paused');
                }
            }
            if (event.code === 'KeyD') {
                this.debugMode = !this.debugMode;
                console.log(this.debugMode ? 'Debug ON' : 'Debug OFF');
            }
            if (event.code === 'KeyR') {
                this.reset();
                console.log('Reset');
            }
        });
    }

    reset() {
        const HEIGHT = this.canvas.height;

        this.box1.position.set(200, 100);
        this.box2.position.set(250, 100);
        this.circle.position.set(400, 50);
        this.stackBox1.position.set(600, HEIGHT - 170);
        this.stackBox2.position.set(600, HEIGHT - 240);
        this.stackBox3.position.set(600, HEIGHT - 310);
        this.circle1.position.set(100, 300);
        this.circle2.position.set(170, 300);
        this.circle3.position.set(240, 300);
        this.triangle.position.set(350, 200);
        this.targetBox.position.set(350, 350);

        this.engine.bodies.forEach(body => {
            body.velocity.set(0, 0);
            body.angularVelocity = 0;
            body.rotation = 0;
        });
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
        
        if (this.isPaused) {
            this.renderPauseOverlay();
        }
    }

    renderDebugInfo(contacts) {
        this.ctx.fillStyle = '#00ffff';
        this.ctx.strokeStyle = '#00ffff';
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

            if (contact.contacts.length > 2) {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.moveTo(contact.contacts[0].x, contact.contacts[0].y);
                for (let i = 1; i < contact.contacts.length; i++) {
                    this.ctx.lineTo(contact.contacts[i].x, contact.contacts[i].y);
                }
                this.ctx.closePath();
                this.ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
                this.ctx.fill();
                this.ctx.restore();
            }
        }
    }

    renderPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 250, 30);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('PAUSED - SPACE: pause/resume, D: debug toggle', 15, 30);
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