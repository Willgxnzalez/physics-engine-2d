import { Engine } from './src/core/Engine.js';
import { Shapes } from './src/factory/Shapes.js';
import { Renderer } from './src/render/Renderer.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const engine = new Engine();

const ground = Shapes.rectangle(400, 580, 800, 40, { isStatic: true });
const box = Shapes.rectangle(400, 100, 50, 50);

engine.addBody(ground);
engine.addBody(box);

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  engine.update(1 / 60);
  Renderer.render(ctx, engine.bodies);
  requestAnimationFrame(loop);
}

loop();