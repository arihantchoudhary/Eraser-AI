// TorusFractalBackground.js
// A standalone version that can be embedded in any website

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Define colors for each depth level
const DEPTH_COLORS = [
  '#ff0000', // Red
  '#00ff00', // Green
  '#0000ff', // Blue
  '#ffff00', // Yellow
  '#ff00ff', // Magenta
];

class TorusFractalBackground {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    // Create scene
    this.scene = new THREE.Scene();

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 15;

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 1);
    this.container.appendChild(this.renderer.domElement);

    // Add controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 2.0;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Create root torus
    this.createFractal(4, 2, 4, 0, [0, 0, 0]);

    // Handle resize
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // Start animation loop
    this.animate();
  }

  createFractal(radius, tubeRadius, depth, delayIndex, position, parent = null) {
    // Create torus
    const geometry = new THREE.TorusGeometry(radius, tubeRadius, 12, 48);
    const colorIndex = 4 - depth;
    const color = DEPTH_COLORS[colorIndex] || '#ffffff';
    const material = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true
    });

    const torus = new THREE.Mesh(geometry, material);
    torus.position.set(position[0], position[1], position[2]);
    torus.scale.set(0.001, 0.001, 0.001);
    this.scene.add(torus);

    // Store for animation
    torus.userData = {
      depth,
      delayTime: delayIndex * 500,
      startTime: Date.now() + delayIndex * 500,
      growing: true
    };

    // Track all tori
    if (!this.allTori) this.allTori = [];
    this.allTori.push(torus);

    // Create children after delay if depth > 0
    if (depth > 0) {
      setTimeout(() => {
        const childRadius = tubeRadius / 2;
        const childTubeRadius = childRadius / 2; // Keep 1:2 aspect ratio

        // Create 4 children
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          // Create child group
          const group = new THREE.Group();
          group.position.set(position[0] + x, position[1] + y, position[2]);

          // Calculate rotation to face parent's center
          const dirX = -Math.cos(angle);
          const dirY = -Math.sin(angle);
          const rotationAngle = Math.atan2(dirY, dirX);
          group.rotation.set(Math.PI / 2, Math.PI / 2, rotationAngle);

          // Store for animation
          group.userData = {
            depth,
            rotationTime: Date.now()
          };

          this.scene.add(group);

          // Create the child torus
          this.createFractal(
            childRadius,
            childTubeRadius,
            depth - 1,
            delayIndex + 1,
            [0, 0, 0],
            group
          );

          if (!this.allGroups) this.allGroups = [];
          this.allGroups.push(group);
        }
      }, delayIndex * 500);
    }

    return torus;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Animate growth for all tori
    const now = Date.now();
    if (this.allTori) {
      this.allTori.forEach(torus => {
        if (torus.userData.growing && now > torus.userData.startTime) {
          const elapsedTime = now - torus.userData.startTime;
          const scale = Math.min(1, elapsedTime / 500);
          torus.scale.set(scale, scale, scale);

          if (scale >= 1) {
            torus.userData.growing = false;
          }
        }
      });
    }

    // Animate rotations for all groups
    if (this.allGroups) {
      this.allGroups.forEach(group => {
        const t = (now - group.userData.rotationTime) / 1000;
        const depth = group.userData.depth;

        // Each depth level rotates at different speeds around each axis
        group.rotation.x = Math.PI / 2 + t * 0.5 * (depth * 0.3);
        group.rotation.y = Math.PI / 2 + t * 0.7 * (depth * 0.2);
        group.rotation.z = t * 0.3 * (depth * 0.4) + group.rotation.z % (Math.PI * 2);
      });
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Export for use
export default TorusFractalBackground;
