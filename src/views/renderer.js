import * as THREE from "three";
import SceneRef from "views/utils/scene-ref";
import OnReadyScheduler from "views/utils/scheduler";
import "./renderer.scss";

const SR = new SceneRef();

function presentScene() {
  const { scene, camera, renderer } = SR.setup({
    fov: 75,
    near: 0.1,
    far: 1000,
    camZPos: 2,
    width: window.innerWidth,
    height: window.innerHeight,
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

  empty(document.body).appendChild(renderer.domElement);

  SR.animate(() => {
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;

    renderer.render(scene, camera);
  });
}

function empty(el) {
  while (el && el.firstChild) { el.removeChild(el.firstChild); }
  return el;
}

/** camera/renderer should adapt to window resizing */
window.addEventListener("resize", () => {
  const { camera, renderer } = SR;

  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}, false);

new OnReadyScheduler().schedule(presentScene);
