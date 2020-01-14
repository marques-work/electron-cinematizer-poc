import * as THREE from "three";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import TROOPER from "views/images/stormtrooper.dae";
import "views/images/Stormtrooper_D.jpg";

export default {
  setup(view, container) {
    const { camera, renderer } = view.setup({
      fov: 25,
      near: 1,
      far: 1000,
      camPos: [15, 10, -15],
      renderOpts: { antialias: true },
    });

    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    // collada

    const loader = new ColladaLoader();
    let mixer;
    loader.load(TROOPER, (collada) => {
      const { animations } = collada;
      const avatar = collada.scene;

      avatar.traverse((node) => {
        if (node.isSkinnedMesh) {
          node.frustumCulled = false; // eslint-disable-line no-param-reassign
        }
      });

      mixer = new THREE.AnimationMixer(avatar);
      mixer.clipAction(animations[0]).play();

      scene.add(avatar);
    });

    const gridHelper = new THREE.GridHelper(10, 20);
    scene.add(gridHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    scene.add(camera);
    camera.add(pointLight);

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = true;
    controls.minDistance = 5;
    controls.maxDistance = 40;
    controls.target.set(0, 2, 0);
    controls.update();

    view.animate(() => {
      const delta = clock.getDelta();

      if (mixer !== undefined) {
        mixer.update(delta);
      }

      renderer.render(scene, camera);
    });
  },

  teardown() {},
};
