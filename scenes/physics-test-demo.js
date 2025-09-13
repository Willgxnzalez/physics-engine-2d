import { Engine } from '../../src/core/Engine.js';
import { Shapes } from '../../src/factory/Shapes.js';
import { Renderer } from '../../src/render/Renderer.js';
import { GravityForce } from '../src/core/Force.js';

export class PhysicsTestDemo {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.engine = new Engine();
        this.isPaused = false;
        this.debugMode = true;
        this.width = canvas.width;
        this.height = canvas.height;
        this.dt = 1 / 60;
        
        this.setupDemo();
        this.setupControls();
    }

    setupDemo() {
        // Clear existing bodies
        this.engine.bodies = [];

        const borderThickness = 15;
        this.borderBottom = Shapes.Rect(this.width / 2, this.height - borderThickness / 2, this.width, borderThickness, { isStatic: true, restitution: 0.5 });
        this.borderTop = Shapes.Rect(this.width / 2, borderThickness / 2, this.width, borderThickness, { isStatic: true });
        this.borderLeft = Shapes.Rect(borderThickness / 2, this.height / 2, borderThickness, this.height, { isStatic: true });
        this.borderRight = Shapes.Rect(this.width - borderThickness / 2, this.height / 2, borderThickness, this.height, { isStatic: true });
        this.ramp1 = Shapes.Rect(300, 150, 250, borderThickness, { isStatic: true });
        this.ramp2 = Shapes.Rect(500, 250, 250, borderThickness, { isStatic: true });
        this.ramp3 = Shapes.Rect(300, 350, 250, borderThickness, { isStatic: true });
        this.ramp4 = Shapes.Rect(500, 450, 250, borderThickness, { isStatic: true });

        this.ramp1.rotate(Math.PI / 7);
        this.ramp2.rotate(Math.PI - Math.PI / 7)
        this.ramp3.rotate(Math.PI / 7);
        this.ramp4.rotate(Math.PI - Math.PI / 7)

        this.box1 = Shapes.Rect(110, 110, 70, 70, { mass: 1 });
        this.box2 = Shapes.Rect(230, 110, 110, 110, { mass: 1 });
        this.circle = Shapes.Circle(250, 60, 30, 
            { 
                mass: 1 ,
                restitution: 0.9,
                friction: 0.1
            }
        );
        
        this.triangle1 = Shapes.Triangle(0, this.height, this.width/1.5, { mass: 1}); 
        this.triangle2 = Shapes.Triangle(this.width, this.height, this.width/1.5, { mass: 1});
        this.triangle1.rotate(Math.PI);
        this.triangle2.rotate(Math.PI);
        this.triangle1.makeStatic();
        this.triangle2.makeStatic();
        
        this.engine.addBody(this.borderBottom);
        this.engine.addBody(this.borderTop);
        this.engine.addBody(this.borderLeft);
        this.engine.addBody(this.borderRight);
        this.engine.addBody(this.ramp1);
        this.engine.addBody(this.ramp2);
        this.engine.addBody(this.ramp3);
        this.engine.addBody(this.ramp4);
        // this.engine.addBody(this.box1);
        // this.engine.addBody(this.box2);
        this.engine.addBody(this.triangle1);
        this.engine.addBody(this.triangle2);

        this.engine.addForce(new GravityForce({ strength: 200 }));
        // Ball spawner: spawn a new ball every 2 seconds
        if (this.ballSpawner) clearInterval(this.ballSpawner);
        this.ballSpawner = setInterval(() => {
            // Clone the original circle's properties for each new ball
            const spawnCircle = Shapes.Circle(
                250, 60, 30,
                { 
                    mass: 1,
                    restitution: 0.9,
                    friction: 0.1
                }
            );
            this.engine.addBody(spawnCircle);
        }, 4000);

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
            if (event.code === 'KeyW') {
                this.dt += 1/360;
            }

            if (event.code === 'KeyS') {
                this.dt = 1/60;
            }
        });
    }

    update() {
        if (!this.isPaused) {
            this.engine.update(this.dt);
        }
        console.log(this.dt)
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        Renderer.renderBodies(this.ctx, this.engine.bodies, this.debugMode);
        
        if (this.debugMode) {
            Renderer.renderContacts(this.ctx, this.engine.getManifolds())
        }

        if (this.isPaused) {
            this.renderPauseOverlay();
        }
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
