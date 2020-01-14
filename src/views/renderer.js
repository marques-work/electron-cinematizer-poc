// import * as THREE from "three";
import { ipcRenderer } from "electron";
import { ScenePresenter } from "views/utils/scene-control";
import OnReadyScheduler from "views/utils/scheduler";

// scenes
import BasicScene from "./scenes/basic";
import PointCube from "./scenes/point-cube";
import BufferGeometry from "./scenes/buffer-geo";
import BufferGeometry2 from "./scenes/buffer-geo-2";
import StupidTrooper from "./scenes/stupid-trooper";
import PointLights from "./scenes/point-lights";
import Skeletal from "./scenes/skeletal";

// styles
import "./renderer.scss";

const SP = new ScenePresenter();
const SCENES = new Map([
  ["basic", BasicScene],
  ["point-cube", PointCube],
  ["buffer-geo", BufferGeometry],
  ["buffer-geo-2", BufferGeometry2],
  ["stupid-trooper", StupidTrooper],
  ["point-lights", PointLights],
  ["skeletal", Skeletal],
]);

function empty(el) {
  while (el && el.firstChild) { el.removeChild(el.firstChild); }
  return el;
}

/** camera/renderer should adapt to window resizing */
window.addEventListener("resize", () => {
  const { camera, renderer } = SP.view;

  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}, false);

ipcRenderer.on("update.scene", (_, arg) => {
  SP.present(SCENES.get(arg), empty(document.body)); // no error checking, for now.
});

new OnReadyScheduler().schedule(() => SP.present(BasicScene, empty(document.body)));
