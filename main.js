import { Engine } from './src/core/Engine.js';
import { Shapes } from './src/factory/Shapes.js';
import { Renderer } from './src/render/Renderer.js';
import { Vec2 } from './src/geometry/Vec2.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const engine = new Engine();

const ground = Shapes.Rect(WIDTH - WIDTH/2, HEIGHT - 25, WIDTH, 50, { isStatic: true });
const box = Shapes.Rect(100, 0, 50, 50, { isStatic: true });
const box2 = Shapes.Rect(300, 0, 50, 50);
const circle = Shapes.Circle(500, 0, 100, { mass: 100, segments: 24 });
const pentagon = Shapes.Circle(300, 300, 50, { mass: 10, segments: 5});
const spinBox = Shapes.Rect(200, 0, 50, 50, { mass: 1 });

engine.addBody(ground);
engine.addBody(box);
engine.addBody(box2);
engine.addBody(circle);
engine.addBody(pentagon);
engine.addBody(spinBox);

const spin = () => {
  spinBox.applyTorque(10);
};
spin();
setInterval(() => spin(), 10);

const DEBUG_DRAW_BOUNDS = true;

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  engine.update(1 / 60);
  Renderer.render(ctx, engine.bodies, DEBUG_DRAW_BOUNDS);
  requestAnimationFrame(loop);

  for (const body of engine.bodies) {
    if (body.position.y > HEIGHT) {
      body.position.y = 0;
      body.velocity.y = 0;
    }
  }
}

loop();