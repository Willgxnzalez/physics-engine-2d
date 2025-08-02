import { ShapesTestDemo } from './scenes/shapes-test.js';
import { RotationTestDemo } from './scenes/rotation-test.js';
import { BasicCollisionDemo } from './scenes/basic-collision.js';

const canvas = document.getElementById('canvas');

// Choose which demo to run
const DEMO_TYPE = 'coll'; // Change to 'shapes' or 'rotation'

let demo;
if (DEMO_TYPE === 'rotation') {
    demo = new RotationTestDemo(canvas);
} else if (DEMO_TYPE === 'shapes') {
    demo = new ShapesTestDemo(canvas);
} else {
    demo = new BasicCollisionDemo(canvas);
}

demo.run();