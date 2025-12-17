// WalkThroughPage.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Loader } from '@react-three/drei';

const WalkThroughModel = () => {
  // const { scene } = useGLTF('/models/your-model.glb'); 
  // return <primitive object={scene} scale={0.1} />;
};

const WalkThroughPage = () => {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [2, 2, 5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <WalkThroughModel />
          <Environment preset="sunset" background />
        </Suspense>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
      <Loader />
    </div>
  );
};

export default WalkThroughPage;
