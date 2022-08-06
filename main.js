// https://www.youtube.com/watch?v=YHT8arVWXWI
// https://github.com/Shin-sibainu/cubecamera-envmap

// 【ツール】パノラマ画像→キューブマップ変換【JavaScript】
// https://christinayan01.jp/architecture/archives/14067
// デザインおしゃれ手帳 / 【Three.js】環境マッピングその２
// https://blog.design-nkt.com/osyare-threejs9/
// Humus / キューブマップ
// http://www.humus.name/index.php?page=Textures

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import NissiBeach_r from "./envImage/Nissi-beach/Nissi-beach_r.jpg";
import NissiBeach_l from "./envImage/Nissi-beach/Nissi-beach_l.jpg";
import NissiBeach_u from "./envImage/Nissi-beach/Nissi-beach_u.jpg";
import NissiBeach_d from "./envImage/Nissi-beach/Nissi-beach_d.jpg";
import NissiBeach_f from "./envImage/Nissi-beach/Nissi-beach_f.jpg";
import NissiBeach_b from "./envImage/Nissi-beach/Nissi-beach_b.jpg";
import ArstaBridge_r from "./envImage/Arsta-bridge/Arsta-bridge_r.jpg";
import ArstaBridge_l from "./envImage/Arsta-bridge/Arsta-bridge_l.jpg";
import ArstaBridge_u from "./envImage/Arsta-bridge/Arsta-bridge_u.jpg";
import ArstaBridge_d from "./envImage/Arsta-bridge/Arsta-bridge_d.jpg";
import ArstaBridge_f from "./envImage/Arsta-bridge/Arsta-bridge_f.jpg";
import ArstaBridge_b from "./envImage/Arsta-bridge/Arsta-bridge_b.jpg";
import earth_r from "./envImage/earth/earth_r.jpg";
import earth_l from "./envImage/earth/earth_l.jpg";
import earth_u from "./envImage/earth/earth_u.jpg";
import earth_d from "./envImage/earth/earth_d.jpg";
import earth_f from "./envImage/earth/earth_f.jpg";
import earth_b from "./envImage/earth/earth_b.jpg";

const canvas = document.getElementById("canvas");

// scene
const scene = new THREE.Scene();

// sizes
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  3000
); // (視野角, アスペクト比, near, far)
camera.position.set(0, 500, 1000);
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true }); // antialias: true → ギザギザ抑止
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

// envImage
const urlSets = [
  [
    NissiBeach_r,
    NissiBeach_l,
    NissiBeach_u,
    NissiBeach_d,
    NissiBeach_f,
    NissiBeach_b,
  ],
  [
    ArstaBridge_r,
    ArstaBridge_l,
    ArstaBridge_u,
    ArstaBridge_d,
    ArstaBridge_f,
    ArstaBridge_b,
  ],
  [earth_r, earth_l, earth_u, earth_d, earth_f, earth_b],
];
let pathIdx = 0;
let urls = urlSets[pathIdx];

// 背景に環境マップを読み込み
const loader = new THREE.CubeTextureLoader();
scene.background = loader.load(urls);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // 慣性を有効

// cube camera
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(700); // (解像度)
const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget); // (near, far, target)
scene.add(cubeCamera);

// object - cube
const material = new THREE.MeshBasicMaterial({
  envMap: cubeRenderTarget.texture, // これだけだと真っ黒な texture になるので、実行関数内で cubeCamera.update(renderer, scene) が必要
  // reflectivity: 0.5, // 反射率
});
const geometry = new THREE.SphereGeometry(350, 50, 50);
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0, 100, 0);
// scene.add(sphere); // sphere の表示 → sphere ON/OFF ボタンで制御

function animate() {
  controls.update(); // カメラの設定を上書き
  cubeCamera.update(renderer, scene); // cube オブジェクトに texture を有効化
  renderer.render(scene, camera); // ブラウザに描画
  window.requestAnimationFrame(animate); // フレーム単位で実行（すごく早い間隔で、この関数が何度も実行される）
}

animate();

// sphere ON/OFF ボタン
let flagSphere = false;
document.getElementById("sphere").addEventListener("click", () => {
  flagSphere = !flagSphere;
  if (flagSphere) {
    scene.add(sphere); // sphere の表示
    return;
  }
  scene.remove(sphere);
});

// scene 切り替えボタン
document.getElementById("view").addEventListener("click", () => {
  pathIdx = pathIdx === 0 ? 1 : pathIdx === 1 ? 2 : 0;
  urls = urlSets[pathIdx];
  scene.background = loader.load(urls);
});
