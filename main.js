import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as CANNON from 'cannon-es';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Physics World
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Ground (Physics)
const groundBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Plane()
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// Ground (Visual)
const groundGeo = new THREE.PlaneGeometry(200, 200);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
groundMesh.rotation.x = -Math.PI / 2;
scene.add(groundMesh);

// Car (Physics body)
const carBody = new CANNON.Body({
  mass: 150,
  shape: new CANNON.Box(new CANNON.Vec3(1, 0.5, 2))
});
carBody.position.set(0, 1, 0);
world.addBody(carBody);

// Car (Visual Model or Textured Box)
let carMesh;
const textureLoader = new THREE.TextureLoader();
const carTexture = textureLoader.load('car-texture.jpg', () => {
  const carGeo = new THREE.BoxGeometry(2, 1, 4);
  const carMat = new THREE.MeshStandardMaterial({ map: carTexture });
  carMesh = new THREE.Mesh(carGeo, carMat);
  scene.add(carMesh);
});

// Controls
const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function updateControls() {
  if (keys['ArrowUp']) carBody.applyForce(new CANNON.Vec3(0, 0, -500), carBody.position);
  if (keys['ArrowDown']) carBody.applyForce(new CANNON.Vec3(0, 0, 500), carBody.position);
  if (keys['ArrowLeft']) carBody.angularVelocity.y += 0.05;
  if (keys['ArrowRight']) carBody.angularVelocity.y -= 0.05;
}

// Camera Follow
function updateCamera() {
  camera.position.set(
    carBody.position.x - 6 * Math.sin(carBody.quaternion.y),
    carBody.position.y + 3,
    carBody.position.z + 6 * Math.cos(carBody.quaternion.y)
  );
  camera.lookAt(carBody.position);
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  world.step(1/60);

  updateControls();

  if (carMesh) {
    carMesh.position.copy(carBody.position);
    carMesh.quaternion.copy(carBody.quaternion);
  }

  updateCamera();
  renderer.render(scene, camera);
}
animate();
