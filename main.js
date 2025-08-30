import { PhysicsTestDemo } from './scenes/physics-test-demo.js';

const canvas = document.getElementById('canvas');
const demo = new PhysicsTestDemo(canvas);
demo.run();