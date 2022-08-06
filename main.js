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
const paths = [
  "Nissi-beach/Nissi-beach",
  "Arsta-bridge/Arsta-bridge",
  "earth/earth",
];
let pathIdx = 0;
let urls = [
  `./envImage/${paths[pathIdx]}_r.jpg`,
  `./envImage/${paths[pathIdx]}_l.jpg`,
  `./envImage/${paths[pathIdx]}_u.jpg`,
  `./envImage/${paths[pathIdx]}_d.jpg`,
  `./envImage/${paths[pathIdx]}_f.jpg`,
  `./envImage/${paths[pathIdx]}_b.jpg`,
];

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
  urls = [
    `./envImage/${paths[pathIdx]}_r.jpg`,
    `./envImage/${paths[pathIdx]}_l.jpg`,
    `./envImage/${paths[pathIdx]}_u.jpg`,
    `./envImage/${paths[pathIdx]}_d.jpg`,
    `./envImage/${paths[pathIdx]}_f.jpg`,
    `./envImage/${paths[pathIdx]}_b.jpg`,
  ];
  scene.background = loader.load(urls);
});
