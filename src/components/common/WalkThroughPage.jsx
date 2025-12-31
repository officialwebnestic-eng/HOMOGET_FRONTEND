import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Loader, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// 1. Error Boundary Component to catch WebGL/Fetch crashes
class SceneErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-slate-100 dark:bg-slate-800 rounded-3xl p-8 text-center">
          <p className="text-red-500 font-bold mb-2">3D Experience Unavailable</p>
          <p className="text-sm text-slate-500">Could not load the 3D model. Please check your connection or try again later.</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-xs bg-blue-600 text-white px-4 py-2 rounded-lg">Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const CameraDirector = ({ activeRoom }) => {
  useFrame((state) => {
    if (activeRoom?.position) {
      const targetPos = new THREE.Vector3(...activeRoom.position);
      state.camera.position.lerp(targetPos, 0.05);
      state.camera.lookAt(0, 0, 0); 
    }
  });
  return null;
};

const WalkThroughModel = () => {
  // NOTE: If the Supabase link continues to fail due to CORS, 
  // download the model and use '/models/house.gltf'
  const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-farmhouse/model.gltf');
  return <primitive object={scene} scale={1.5} position={[0, -1, 0]} castShadow receiveShadow />;
};

const WalkThroughPage = ({ activeRoom }) => {
  return (
    <div className="w-full h-full relative">
      <SceneErrorBoundary>
        <Canvas shadows camera={{ position: [5, 5, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
          
          <Suspense fallback={null}>
            <WalkThroughModel />
            <CameraDirector activeRoom={activeRoom} />
            <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={20} blur={2.4} far={4.5} />
            <Environment preset="city" />
          </Suspense>

          <OrbitControls 
            enableDamping={true} 
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 2}
            makeDefault 
          />
        </Canvas>
        {/* Loader shows a progress percentage while the model downloads */}
        <Loader />
      </SceneErrorBoundary>
    </div>
  );
};

export default WalkThroughPage;