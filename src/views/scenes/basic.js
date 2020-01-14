import * as THREE from "three";

export default {
  setup(view, container) {
    const { scene, camera, renderer } = view.setup({
      fov: 75,
      near: 0.1,
      far: 1000,
      camZPos: 2,
    });

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const color = 0xFF77FF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    container.appendChild(renderer.domElement);

    view.animate(() => {
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.005;

      renderer.render(scene, camera);
    });
  },

  teardown() {},
};
