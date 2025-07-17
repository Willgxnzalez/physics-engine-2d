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
        this.ground = Shapes.Rect(WIDTH/2, HEIGHT - 25, WIDTH, 50, { isStatic: true });
        this.box1 = Shapes.Rect(200, 100, 100, 100, { mass: 1 });
        this.box2 = Shapes.Rect(250, 100, 50, 50, { mass: 1 });
        this.circle = Shapes.Circle(400, 50, 80, { mass: 2 });

        this.engine.addBody(this.ground);
        this.engine.addBody(this.box1);
        this.engine.addBody(this.box2);
        this.engine.addBody(this.circle);

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