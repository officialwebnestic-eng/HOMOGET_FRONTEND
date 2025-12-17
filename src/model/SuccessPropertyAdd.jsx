import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

const SuccessPropertyAdd = ({ onClose }) => {
  const mountRef = useRef(null);
  const statusMessages = [
    "Submitting property details...",
    "Processing images...",
    "Verifying information...",
    "Waiting for admin approval",
    "Approval pending"
  ];

  useEffect(() => {
   
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

   
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.9
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

   
    const animateModel = (model) => {
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(model.position, { y: 0.5, duration: 2, ease: "sine.inOut" });
      gsap.to(model.rotation, {
        y: Math.PI * 2,
        duration: 10,
        repeat: -1,
        ease: "none"
      });
    };
    animateModel(cube);

 
    let currentIndex = 0;
    const statusElement = document.getElementById('status-text');
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % statusMessages.length;
      if (statusElement) {
        statusElement.textContent = statusMessages[currentIndex];
      }
    }, 3000);

  
    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };
    window.addEventListener('resize', handleResize);

    
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();


    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-gray/50 bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden">
      
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>


        <div className="bg-indigo-600 p-6 text-center rounded-t-xl">
          <h1 className="text-2xl font-bold text-white">
            Property Submitted Successfully!
          </h1>
        </div>


        <div ref={mountRef} className="w-full h-64 md:h-80 relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="animate-pulse text-gray-400">Loading visualization...</div>
          </div>
        </div>

 
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Approval Status</span>
              <span>Pending</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full animate-pulse"
                style={{ width: '45%' }}
              ></div>
            </div>
          </div>

          <div className="text-center py-4">
            <p id="status-text" className="text-gray-600 animate-pulse">
              {statusMessages[0]}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800">What happens next?</h3>
            <ul className="mt-2 space-y-1 text-sm text-blue-700 list-disc list-inside">
              <li>Our team will review your property</li>
              <li>This typically takes 24-48 hours</li>
              <li>You'll receive an email notification</li>
            </ul>
          </div>

    
          <button
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            onClick={onClose}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPropertyAdd;
