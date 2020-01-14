import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
  setup(view, container) {
    const { camera, renderer } = view.setup({
      fov: 45, near: 1, far: 1000, camPos: [0, 10, 40], renderOpts: { antialias: true },
    });

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x111122));

    // lights

    const pointLight = createLight(0x0088ff);
    scene.add(pointLight);

    const pointLight2 = createLight(0xff8888);
    scene.add(pointLight2);

    const geometry = new THREE.BoxBufferGeometry(30, 30, 30);
    const material = new THREE.MeshPhongMaterial({
      color: 0xa0adaf,
      shininess: 10,
      specular: 0x111111,
      side: THREE.BackSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 10;
    mesh.receiveShadow = true;
    scene.add(mesh);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 10, 0);
    controls.update();

    view.animate(() => {
      let time = performance.now() * 0.001;

      pointLight.position.x = Math.sin(time * 0.6) * 9;
      pointLight.position.y = Math.sin(time * 0.7) * 9 + 6;
      pointLight.position.z = Math.sin(time * 0.8) * 9;

      pointLight.rotation.x = time;
      pointLight.rotation.z = time;

      time += 10000;

      pointLight2.position.x = Math.sin(time * 0.6) * 9;
      pointLight2.position.y = Math.sin(time * 0.7) * 9 + 6;
      pointLight2.position.z = Math.sin(time * 0.8) * 9;

      pointLight2.rotation.x = time;
      pointLight2.rotation.z = time;

      renderer.render(scene, camera);
    });
  },

  teardown() {},
};

function createLight(color) {
  const intensity = 1.5;

  const pointLight = new THREE.PointLight(color, intensity, 20);
  pointLight.castShadow = true;
  pointLight.shadow.camera.near = 1;
  pointLight.shadow.camera.far = 60;
  pointLight.shadow.bias = -0.005; // reduces self-shadowing on double-sided objects

  let geometry = new THREE.SphereBufferGeometry(0.3, 12, 6);
  let material = new THREE.MeshBasicMaterial({ color });
  material.color.multiplyScalar(intensity);
  let sphere = new THREE.Mesh(geometry, material);
  pointLight.add(sphere);

  const texture = new THREE.CanvasTexture(generateTexture());
  texture.magFilter = THREE.NearestFilter;
  texture.wrapT = THREE.RepeatWrapping;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(1, 4.5);

  geometry = new THREE.SphereBufferGeometry(2, 32, 8);
  material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    alphaMap: texture,
    alphaTest: 0.5,
  });

  sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  pointLight.add(sphere);

  // custom distance material
  const distanceMaterial = new THREE.MeshDistanceMaterial({
    alphaMap: material.alphaMap,
    alphaTest: material.alphaTest,
  });
  sphere.customDistanceMaterial = distanceMaterial;

  return pointLight;
}

function generateTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 2;

  const context = canvas.getContext("2d");
  context.fillStyle = "white";
  context.fillRect(0, 1, 2, 1);

  return canvas;
}
