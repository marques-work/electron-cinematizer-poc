import * as THREE from "three";
import { WEBGL } from "three/examples/jsm/WebGL";

export class View {
  camera = null

  renderer = null

  animator = null

  setup({
    fov, aspect, near, far, width = window.innerWidth, height = window.innerHeight, camZ, camPos, renderOpts,
  }) {
    this.stopAnimation(); // stop any previous animation

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, aspect || (width / height), near, far);
    const renderer = createRenderer(renderOpts);
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    if (typeof camZ === "number") { camera.position.z = camZ; }
    if (camPos instanceof Array) { camera.position.set(...camPos); }

    this.camera = camera;
    this.renderer = renderer;
    return { camera, renderer, scene };
  }

  animate(fn) {
    this.stopAnimation();

    let stop = false;
    this.animator = {
      start: function animate(force = false /* allows restarting animation after stop() */) {
        if (!stop || force) {
          if (force) { stop = false; }
          requestAnimationFrame(animate);
        }

        fn();
      },

      stop() {
        stop = true;
      },
    };
    this.animator.start();
  }

  stopAnimation() {
    if (this.animator) { this.animator.stop(); }
  }
}

function createRenderer(opts = {}) {
  if (WEBGL.isWebGL2Available()) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", { alpha: false });
    return new THREE.WebGLRenderer({ canvas, context, ...opts });
  }

  return new THREE.WebGLRenderer(opts);
}

export class ScenePresenter {
  current = null

  view = new View();

  present(scene, container) {
    this.teardown();
    scene.setup(this.view, container);
    this.current = scene;
  }

  teardown() {
    if (this.current) {
      this.current.teardown();
    }

    this.view.stopAnimation();
  }
}
