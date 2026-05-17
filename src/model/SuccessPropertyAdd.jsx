import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Check, Clock, ShieldCheck, ArrowRight, Sparkles, X } from 'lucide-react';

const SuccessPropertyAdd = ({ onClose }) => {
  const mountRef = useRef(null);
  const [currentStatus, setCurrentStatus] = useState(0);

  const statusMessages = [
    "Encoding property blueprints...",
    "Optimizing visual assets...",
    "Securing ledger entry...",
    "Synchronizing with RERA database...",
    "Finalizing luxury profile..."
  ];

  useEffect(() => {
    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Luxury Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xC5A059, 2); // Amber Light
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Create a Luxury "Golden Knot"
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0xC5A059,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: true,
    });
    const knot = new THREE.Mesh(geometry, material);
    scene.add(knot);

    // Floating Animation
    gsap.to(knot.rotation, {
      y: Math.PI * 2,
      x: Math.PI,
      duration: 15,
      repeat: -1,
      ease: "none"
    });

    gsap.to(knot.position, {
      y: 0.3,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Particle Background
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i=0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({ size: 0.005, color: 0xC5A059 });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Status Message Loop
    const interval = setInterval(() => {
      setCurrentStatus((prev) => (prev + 1) % statusMessages.length);
    }, 2500);

    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if(!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white z-20 transition-colors">
          <X size={24} />
        </button>

        {/* 3D Visual Section */}
        <div className="relative h-72 md:h-80 w-full overflow-hidden bg-gradient-to-b from-amber-500/10 to-transparent">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          
          <div className="absolute top-12 left-0 w-full text-center pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
            >
              <Sparkles size={12} /> Submission Active
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
              Legacy <span className="font-serif italic font-light text-amber-500">Established.</span>
            </h2>
          </div>
        </div>

        {/* Info Content */}
        <div className="p-10 pt-0">
          <div className="mb-10">
            <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Pipeline</span>
                <span className="text-xs font-bold text-amber-500">75% Optimized</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                />
            </div>
            <div className="mt-4 text-center h-6">
                <AnimatePresence mode="wait">
                    <motion.p 
                        key={currentStatus}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-sm font-medium text-slate-400 italic"
                    >
                        {statusMessages[currentStatus]}
                    </motion.p>
                </AnimatePresence>
            </div>
          </div>

          {/* Steps Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                <Clock className="text-amber-500 mb-3" size={20} />
                <h4 className="text-white font-bold text-sm mb-1">Review Period</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Our elite curators will verify details within 24-48 hours.</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                <ShieldCheck className="text-amber-500 mb-3" size={20} />
                <h4 className="text-white font-bold text-sm mb-1">RERA Validation</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Property credentials will be cross-referenced with DLD.</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full py-5 bg-amber-500 text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 transition-all"
          >
            Enter Dashboard <ArrowRight size={18} />
          </motion.button>

          <p className="mt-6 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            A confirmation email has been dispatched to your profile.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPropertyAdd;