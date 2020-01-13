import * as THREE from "three";
import { WEBGL } from "three/examples/jsm/WebGL";
import OnReadyScheduler from "views/utils/scheduler";

function presentScene() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = createRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  const animator = createAnimator(() => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  });

  empty(document.body).appendChild(renderer.domElement);
  animator.start();
}

function createAnimator(fn) {
  let stop = false;
  return {
    start: function animate(force = false /* allows restarting animation after stop() */) {
      if (force || !stop) {
        if (force) { stop = false; }
        requestAnimationFrame(animate);
      }

      fn();
    },

    stop() {
      stop = true;
    },
  };
}

function createRenderer() {
  if (WEBGL.isWebGL2Available()) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", { alpha: false });
    return new THREE.WebGLRenderer({ canvas, context });
  }

  return new THREE.WebGLRenderer();
}

function empty(el) {
  while (el && el.firstChild) { el.removeChild(el.firstChild); }
  return el;
}

new OnReadyScheduler().schedule(presentScene);
