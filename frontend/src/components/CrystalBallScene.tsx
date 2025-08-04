/**
 * 🌌 Crystal Ball Scene Component
 * 
 * This component sets up the complete 3D environment for the crystal ball,
 * including lighting, camera controls, and atmospheric effects.
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { CrystalBall, CrystalBase } from './CrystalBall';
import { AppState } from '../types';
import styled from 'styled-components';

interface CrystalBallSceneProps {
  state: AppState;
  className?: string;
}

const SceneContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: transparent;
  pointer-events: none;
  
  canvas {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #81d4fa;
  font-size: 1.2rem;
  font-family: 'Cinzel', serif;
  
  &::after {
    content: '🔮';
    margin-left: 10px;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Ambient lighting component
const SceneLighting: React.FC<{ state: AppState }> = ({ state }) => {
  const intensity = React.useMemo(() => {
    switch (state) {
      case 'greeting': return 0.3;
      case 'asking': return 0.5;
      case 'processing': return 0.8;
      case 'revealed': return 0.6;
      default: return 0.5;
    }
  }, [state]);

  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.2} color="#81d4fa" />
      
      {/* Main directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={intensity}
        color="#ffffff"
        castShadow
      />
      
      {/* Rim lighting for mystical effect */}
      <pointLight
        position={[-10, -10, -5]}
        intensity={intensity * 0.5}
        color="#4a0e4e"
      />
      
      {/* Top light for crystal highlights */}
      <pointLight
        position={[0, 10, 0]}
        intensity={intensity * 0.3}
        color="#81d4fa"
      />
      
      {/* Processing state: additional dramatic lighting */}
      {state === 'processing' && (
        <>
          <pointLight
            position={[5, 0, 5]}
            intensity={0.8}
            color="#ff6b6b"
          />
          <pointLight
            position={[-5, 0, -5]}
            intensity={0.8}
            color="#4ecdc4"
          />
        </>
      )}
    </>
  );
};

// Particle effects for magical atmosphere
const MagicalParticles: React.FC<{ state: AppState }> = ({ state }) => {
  const particleCount = React.useMemo(() => {
    switch (state) {
      case 'greeting': return 50;
      case 'asking': return 100;
      case 'processing': return 300;
      case 'revealed': return 150;
      default: return 100;
    }
  }, [state]);

  return (
    <Stars
      radius={50}
      depth={50}
      count={particleCount}
      factor={4}
      saturation={0}
      fade={true}
      speed={state === 'processing' ? 2 : 0.5}
    />
  );
};

// Camera controls with state-based behavior
const CameraControls: React.FC<{ state: AppState }> = ({ state }) => {
  const enablePan = state === 'greeting' || state === 'revealed';
  const enableZoom = state !== 'processing';
  
  return (
    <OrbitControls
      enablePan={enablePan}
      enableZoom={enableZoom}
      enableRotate={true}
      autoRotate={state === 'greeting'}
      autoRotateSpeed={0.5}
      minDistance={3}
      maxDistance={15}
      minPolarAngle={Math.PI * 0.3}
      maxPolarAngle={Math.PI * 0.7}
    />
  );
};

export const CrystalBallScene: React.FC<CrystalBallSceneProps> = ({ 
  state, 
  className 
}) => {
  return (
    <SceneContainer className={className}>
      <Canvas
        camera={{ 
          position: [0, 2, 8], 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        shadows
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        {/* Suspense for loading 3D assets */}
        <Suspense fallback={null}>
          {/* Scene lighting */}
          <SceneLighting state={state} />
          
          {/* Environment mapping for reflections */}
          <Environment preset="night" />
          
          {/* Magical particles */}
          <MagicalParticles state={state} />
          
          {/* The main crystal ball */}
          <CrystalBall state={state} />
          
          {/* Crystal base/pedestal */}
          <CrystalBase />
          
          {/* Camera controls */}
          <CameraControls state={state} />
        </Suspense>
      </Canvas>
    </SceneContainer>
  );
};

// Loading component for when 3D assets are being loaded
export const SceneLoader: React.FC = () => (
  <SceneContainer>
    <LoadingSpinner>
      Awakening the Oracle
    </LoadingSpinner>
  </SceneContainer>
);

export default CrystalBallScene;
