import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeRobot({ 
  status = 'idle', // 'idle' | 'scanning' | 'discrepancy' | 'verified'
  interactive = true,
  size = 'normal' // 'compact' | 'normal' | 'large'
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x60a5fa, 2.5);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(-5, -3, -2);
    scene.add(rimLight);

    // 4. Robot Group
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    // Metallic chassis materials
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.85,
      roughness: 0.25,
    });

    const darkAccentMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      metalness: 0.9,
      roughness: 0.3,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0x71717a,
      metalness: 0.95,
      roughness: 0.1,
    });

    // Dynamic Visor / Eye Material
    let visorColor = 0x38bdf8; // default cyan
    if (status === 'discrepancy') visorColor = 0xf43f5e; // rose/red
    if (status === 'verified') visorColor = 0x10b981; // emerald
    if (status === 'scanning') visorColor = 0x818cf8; // indigo

    const visorMat = new THREE.MeshBasicMaterial({
      color: visorColor,
      wireframe: false
    });

    // Robot Head (Chamfered Sphere/Box)
    const headGeo = new THREE.BoxGeometry(1.6, 1.2, 1.3);
    const head = new THREE.Mesh(headGeo, chassisMat);
    head.position.y = 1.1;
    robotGroup.add(head);

    // Visor Screen
    const visorGeo = new THREE.BoxGeometry(1.3, 0.45, 0.2);
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.1, 0.65);
    robotGroup.add(visor);

    // Visor Eye Dots / Scanner Line
    const eyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeLeft = new THREE.Mesh(eyeGeo, eyeMat);
    eyeLeft.position.set(-0.35, 1.1, 0.76);
    robotGroup.add(eyeLeft);

    const eyeRight = new THREE.Mesh(eyeGeo, eyeMat);
    eyeRight.position.set(0.35, 1.1, 0.76);
    robotGroup.add(eyeRight);

    // Ear Antennas / Sensors
    const earGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.25, 16);
    const earLeft = new THREE.Mesh(earGeo, chromeMat);
    earLeft.rotation.z = Math.PI / 2;
    earLeft.position.set(-0.9, 1.1, 0);
    robotGroup.add(earLeft);

    const earRight = new THREE.Mesh(earGeo, chromeMat);
    earRight.rotation.z = Math.PI / 2;
    earRight.position.set(0.9, 1.1, 0);
    robotGroup.add(earRight);

    // Antenna Mast
    const antStemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8);
    const antStem = new THREE.Mesh(antStemGeo, chromeMat);
    antStem.position.set(0, 1.9, 0);
    robotGroup.add(antStem);

    const antTipGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const antTip = new THREE.Mesh(antTipGeo, visorMat);
    antTip.position.set(0, 2.2, 0);
    robotGroup.add(antTip);

    // Neck ring
    const neckGeo = new THREE.CylinderGeometry(0.4, 0.5, 0.3, 16);
    const neck = new THREE.Mesh(neckGeo, darkAccentMat);
    neck.position.y = 0.35;
    robotGroup.add(neck);

    // Body Chassis
    const bodyGeo = new THREE.CylinderGeometry(0.85, 1.05, 1.5, 24);
    const body = new THREE.Mesh(bodyGeo, chassisMat);
    body.position.y = -0.55;
    robotGroup.add(body);

    // Chest Core Indicator (Holographic Reactor)
    const coreGeo = new THREE.TorusGeometry(0.35, 0.06, 16, 32);
    const core = new THREE.Mesh(coreGeo, visorMat);
    core.position.set(0, -0.45, 0.95);
    robotGroup.add(core);

    const coreInnerGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const coreInner = new THREE.Mesh(coreInnerGeo, visorMat);
    coreInner.position.set(0, -0.45, 0.9);
    robotGroup.add(coreInner);

    // Floating Holographic Audit Orbit Ring
    const orbitGeo = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const orbitMat = new THREE.MeshBasicMaterial({ 
      color: visorColor, 
      transparent: true, 
      opacity: 0.6 
    });
    const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
    orbitRing.rotation.x = Math.PI / 3;
    robotGroup.add(orbitRing);

    // Floating Data Node on Ring
    const nodeGeo = new THREE.OctahedronGeometry(0.12);
    const node = new THREE.Mesh(nodeGeo, chromeMat);
    robotGroup.add(node);

    // Hovering Base Thruster Emitter
    const thrusterGeo = new THREE.ConeGeometry(0.45, 0.4, 16);
    const thruster = new THREE.Mesh(thrusterGeo, darkAccentMat);
    thruster.rotation.x = Math.PI;
    thruster.position.y = -1.45;
    robotGroup.add(thruster);

    // 5. Mouse Interaction Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.6;
      mouseY = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. Animation Loop
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth floating bob motion
      robotGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.12;

      // Mouse tracking interpolation
      targetRotationY += (mouseX - targetRotationY) * 0.06;
      targetRotationX += (mouseY - targetRotationX) * 0.06;

      head.rotation.y = targetRotationY * 0.8;
      head.rotation.x = -targetRotationX * 0.5;
      visor.rotation.y = targetRotationY * 0.8;
      visor.rotation.x = -targetRotationX * 0.5;
      eyeLeft.rotation.y = targetRotationY * 0.8;
      eyeRight.rotation.y = targetRotationY * 0.8;

      robotGroup.rotation.y = targetRotationY * 0.3;

      // Orbit ring spin
      orbitRing.rotation.z = elapsedTime * 0.7;
      orbitRing.rotation.y = Math.sin(elapsedTime * 0.5) * 0.2;

      // Node movement along circle
      const angle = elapsedTime * 1.2;
      node.position.x = Math.cos(angle) * 2.1;
      node.position.y = Math.sin(angle) * 2.1 * Math.sin(Math.PI / 3);
      node.position.z = Math.sin(angle) * 2.1 * Math.cos(Math.PI / 3);
      node.rotation.x += 0.02;
      node.rotation.y += 0.03;

      // Breathing reactor core
      const pulse = 1 + Math.sin(elapsedTime * 4) * 0.08;
      core.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 300;
      const newH = container.clientHeight || 300;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [status, interactive]);

  const heightClass = size === 'compact' ? 'h-48' : size === 'large' ? 'h-80 sm:h-96' : 'h-64 sm:h-72';

  return (
    <div 
      ref={mountRef} 
      className={`w-full ${heightClass} flex items-center justify-center relative cursor-grab active:cursor-grabbing select-none`}
      title="Interactive 3D Robot Guide (Move mouse to interact)"
    />
  );
}
