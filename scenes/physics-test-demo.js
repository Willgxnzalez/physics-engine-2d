import { Engine } from '../../src/core/Engine.js';
import { Shapes } from '../../src/factory/Shapes.js';
import { Renderer } from '../../src/render/Renderer.js';
import { Vec2 } from '../../src/geometry/Vec2.js';
import { Detector } from '../../src/collision/Detector.js';

export class PhysicsTestDemo {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.engine = new Engine();
        this.isPaused = false;
        this.debugMode = true;
        this.width = canvas.width;
        this.height = canvas.height;
        
        this.setupDemo();
        this.setupControls();
    }

    setupDemo() {
        // Clear existing bodies
        this.engine.bodies = [];
        
        // Create ground
        this.ground = Shapes.Rect(this.width/2, this.height - 100, this.width, 50, { isStatic: true });
        this.engine.addBody(this.ground);

        // Create collision test shapes (from basic-collision)
        this.box1 = Shapes.Rect(200, 100, 50, 50, { mass: 1 });
        this.box2 = Shapes.Rect(250, 100, 200, 200, { mass: 1 });
    
        this.circle1 = Shapes.Circle(400, 50, 120, { mass: 2 });
        this.circle2 = Shapes.Circle(100, 300, 70, { mass: 1 });

        // Stack of boxes
        this.stackBox1 = Shapes.Rect(600, this.height - 500, 100, 100, { mass: 1 });
        this.stackBox2 = Shapes.Rect(600, this.height - 350, 100, 100, { mass: 1 });
        this.stackBox3 = Shapes.Rect(600, this.height - 200, 100, 100, { mass: 1 });

        // Triangle
        this.triangle = Shapes.Circle(350, 200, 100, { mass: 1, segments: 3 });
        this.triangle.rotate(Math.PI / 4);

        // Add all bodies to engine
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
                this.isPaused = !this.isPaused;
                console.log(this.isPaused ? 'Paused' : 'Resumed');
            }
            if (event.code === 'KeyD') {
                this.debugMode = !this.debugMode;
                console.log(this.debugMode ? 'Debug ON' : 'Debug OFF');
            }
            if (event.code === 'KeyR') {
                this.setupDemo(); // Reset by calling setup again
                console.log('Demo reset');
            }
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
        
        this.renderInfo();
        
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
            const normalStart = contact.referenceBody.position;
            const normalEnd = normalStart.clone().addEq(contact.normal.scale(normalSize));
            this.ctx.beginPath();
            this.ctx.moveTo(normalStart.x, normalStart.y);
            this.ctx.lineTo(normalEnd.x, normalEnd.y);
            this.ctx.stroke();
            
            // Draw deepest contact points
            for (const contactPoint of contact.deepestContacts) {
                this.ctx.beginPath();
                this.ctx.arc(contactPoint.x, contactPoint.y, 4, 0, 2 * Math.PI);
                this.ctx.fill();
            }

            // Draw contact polygon for multiple contacts
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

    renderInfo() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(10, 10, 400, 150);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Arial';
        
        const lines = [
            'PHYSICS TEST DEMO',
            '',
            'Test Shapes:',
            '• Boxes: Various sizes for collision testing',
            '• Circles: Large and small dynamic bodies',
            '• Triangle: Rotated polygon shape',
            '• Stack: Multiple boxes for stability testing',
            '',
            'Controls:',
            'SPACE: Pause/Resume',
            'D: Toggle Debug Mode (normals, contacts)',
            'R: Reset Demo'
        ];
        
        lines.forEach((line, index) => {
            this.ctx.fillText(line, 15, 30 + index * 15);
        });
    }

    renderPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 170, 300, 30);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('PAUSED - Press SPACE to resume', 15, 190);
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
