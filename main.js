import { Engine } from './src/core/Engine.js';
import { Shapes } from './src/factory/Shapes.js';
import { Renderer } from './src/render/Renderer.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const engine = new Engine();

const ground = Shapes.rectangle(WIDTH - WIDTH/2, HEIGHT - 25, WIDTH, 50, { isStatic: true });
const box = Shapes.rectangle(300, 0, 50, 50, { isStatic: false });
const box2 = Shapes.rectangle(300, 200, 50, 50, { isStatic: false });

engine.addBody(ground);
engine.addBody(box);
engine.addBody(box2);

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  engine.update(1 / 60);
  Renderer.render(ctx, engine.bodies);
  requestAnimationFrame(loop);
}

loop();