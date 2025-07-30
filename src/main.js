import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import mesh from "./mesh.js";
import { batchRenderer } from "./mesh.js";
import WavesEffect from "./waves.js";

let scene, camera, renderer, controls;
let isPaused = false;
let wavesEffect;

function init() {
  // 场景设置
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // 相机设置
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 30);

  // 渲染器设置
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const canvasContainer = document.getElementById("canvas-container");
  if (canvasContainer) {
    canvasContainer.appendChild(renderer.domElement);
  } else {
    document.body.appendChild(renderer.domElement);
  }

  // 控制器设置
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.enableZoom = true;
  controls.minDistance = 15;
  controls.maxDistance = 50;

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  // 添加粒子组
  scene.add(mesh);

  // 初始化波浪效果
  initWaves();

  // 隐藏加载界面
  setTimeout(() => {
    const loading = document.getElementById("loading");
    if (loading) {
      loading.style.opacity = "0";
      setTimeout(() => {
        loading.style.display = "none";
      }, 1000);
    }
  }, 2000);
}

function initWaves() {
  const wavesContainer = document.getElementById("waves-container");
  if (wavesContainer) {
    wavesEffect = new WavesEffect(wavesContainer, {
      lineColor: "rgba(147, 0, 211, 0.9)", // 鲜艳的紫色
      waveSpeedX: 0.0125,
      waveSpeedY: 0.005,
      waveAmpX: 25,
      waveAmpY: 12,
      xGap: 15,
      yGap: 25,
      friction: 0.925,
      tension: 0.005,
      maxCursorMove: 80,
    });
  }
}

function animate() {
  requestAnimationFrame(animate);

  if (!isPaused) {
    controls.update();
    if (batchRenderer) {
      batchRenderer.update(0.016);
    }
    renderer.render(scene, camera);
  }
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 全局控制函数
window.restartAnimation = function () {
  if (wavesEffect) {
    wavesEffect.destroy();
    initWaves();
  }
};

window.togglePause = function () {
  isPaused = !isPaused;
  const btn = document.querySelector(".control-btn:nth-child(2)");
  if (btn) {
    btn.innerHTML = isPaused ? "▶️ Play" : "⏸️ Pause";
  }
};

window.toggleFullscreen = function () {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

// 事件监听
window.addEventListener("resize", handleResize);

window.addEventListener("beforeunload", () => {
  if (wavesEffect) {
    wavesEffect.destroy();
  }
});

// 初始化
init();
animate();
