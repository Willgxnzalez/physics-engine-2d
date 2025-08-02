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
        this.width = canvas.width;
        this.height = canvas.height;
        
        this.setup();
        this.setupControls();
    }

    setup() {
        // Create bodies for collision testing
        this.ground = Shapes.Rect(this.width/2, this.height - 100, this.width, 50, { isStatic: true });

        this.box1 = Shapes.Rect(200, 100, 50, 50, { mass: 1 });
        this.box2 = Shapes.Rect(250, 100, 200, 200, { mass: 1 });

        this.circle1 = Shapes.Circle(400, 50, 120, { mass: 2 });
        this.circle2 = Shapes.Circle(100, 300, 70, { mass: 1 });

        this.stackBox1 = Shapes.Rect(600, this.height - 500, 100, 100, { mass: 1 });
        this.stackBox2 = Shapes.Rect(600, this.height - 350, 100, 100, { mass: 1 });
        this.stackBox3 = Shapes.Rect(600, this.height - 200, 100, 100, { mass: 1 });


        this.triangle = Shapes.Circle(350, 200, 100, { mass: 1, segments: 3 });
        this.triangle.rotate(Math.PI / 4);

        this.engine.addBody(this.ground); 
        this.engine.addBody(this.box1);
        this.engine.addBody(this.box2);
        this.engine.addBody(this.circle1);
        this.engine.addBody(this.circle2);
        this.engine.addBody(this.stackBox1);
        this.engine.addBody(this.stackBox2);
        this.engine.addBody(this.stackBox3);
        this.engine.addBody(this.triangle);

        this.engine.setGravityStrength(10);
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
        this.box1.position.set(200, 100);
        this.box2.position.set(250, 100);
        this.stackBox1.position.set(600, this.height - 500);
        this.stackBox2.position.set(600, this.height - 350);
        this.stackBox3.position.set(600, this.height - 200);
        this.circle1.position.set(400, 50);
        this.circle2.position.set(100, 300);
        this.triangle.position.set(350, 200);

        this.engine.bodies.forEach(body => {
            body.velocity.set(0, 0);
            body.angularVelocity = 0;
        });
    }

    update() {
        if (!this.isPaused) {
            this.engine.update(1 / 60);
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
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

            // Draw collision normals
            const normalSize = 30;
            const normalStart = contact.bodyA.position;
            const normalEnd = normalStart.add(contact.normal.scale(normalSize));
            this.ctx.beginPath();
            this.ctx.moveTo(normalStart.x, normalStart.y);
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
                this.ctx.fillStyle = 'rgba(255, 163, 227, 0.54)';
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