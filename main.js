import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Ground
const groundBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

const groundGeo = new THREE.PlaneGeometry(100, 100);
const groundMat = new THREE.MeshBasicMaterial({ color: 0x228B22 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
groundMesh.rotation.x = -Math.PI / 2;
scene.add(groundMesh);

// Car
const carBody = new CANNON.Body({
  mass: 150,
  shape: new CANNON.Box(new CANNON.Vec3(1, 0.5, 2)),
});
carBody.position.set(0, 1, 0);
world.addBody(carBody);

const carGeo = new THREE.BoxGeometry(2, 1, 4);
const carMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const carMesh = new THREE.Mesh(carGeo, carMat);
scene.add(carMesh);

camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Game loop
function animate() {
  requestAnimationFrame(animate);
  world.step(1 / 60);

  carMesh.position.copy(carBody.position);
  carMesh.quaternion.copy(carBody.quaternion);

  renderer.render(scene, camera);
}
animate();
