/**
 * 🔮 Magical Crystal Ball Component
 * 
 * This component creates the 3D crystal ball that serves as the centerpiece
 * of the Destiny Engine. It responds to user interactions and app state changes
 * with beautiful animations and magical effects.
 */

import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { CrystalBallProps } from '../types';

// Custom shader material for the magical crystal effect
const CrystalMaterial = shaderMaterial(
  {
    uTime: 0,
    uIntensity: 1.0,
    uColor1: new THREE.Color('#4a0e4e'),
    uColor2: new THREE.Color('#81d4fa'),
    uColor3: new THREE.Color('#ffffff'),
  },
  // Vertex shader
  `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vUv = uv;
      
      // Add subtle vertex displacement for organic movement
      vec3 pos = position;
      pos += normal * sin(uTime * 2.0 + position.y * 10.0) * 0.02;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uIntensity;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    
    // Noise function for mystical swirls
    float noise(vec3 p) {
      return sin(p.x * 10.0 + uTime) * sin(p.y * 10.0 + uTime * 1.1) * sin(p.z * 10.0 + uTime * 0.9);
    }
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      
      // Fresnel effect for crystal-like appearance
      float fresnel = pow(1.0 - dot(normal, viewDirection), 2.0);
      
      // Mystical swirl pattern
      float swirl = noise(vPosition * 2.0 + vec3(uTime * 0.5));
      float pattern = sin(vUv.y * 20.0 + uTime * 2.0 + swirl) * 0.5 + 0.5;
      
      // Color mixing based on position and time
      vec3 color = mix(uColor1, uColor2, pattern);
      color = mix(color, uColor3, fresnel * uIntensity);
      
      // Add depth and glow
      float alpha = fresnel * 0.8 + 0.2;
      alpha *= uIntensity;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
);

export const CrystalBall: React.FC<CrystalBallProps> = ({ 
  state, 
  intensity = 1.0, 
  rotation = [0, 0, 0] 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  // Animation based on app state
  const stateIntensity = useMemo(() => {
    switch (state) {
      case 'greeting': return 0.3;
      case 'asking': return 0.6;
      case 'processing': return 1.2;
      case 'revealed': return 0.8;
      default: return 0.5;
    }
  }, [state]);

  const rotationSpeed = useMemo(() => {
    switch (state) {
      case 'greeting': return 0.002;
      case 'asking': return 0.005;
      case 'processing': return 0.02;
      case 'revealed': return 0.003;
      default: return 0.005;
    }
  }, [state]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth rotation
      meshRef.current.rotation.y += rotationSpeed;
      meshRef.current.rotation.x += rotationSpeed * 0.3;
      
      // Gentle floating motion
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    if (materialRef.current) {
      // Update shader uniforms
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uIntensity = stateIntensity * intensity;
    }
  });

  return (
    <group>
      {/* Main crystal ball */}
      <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[0, 0, 0]}>
        <primitive 
          ref={materialRef}
          object={new CrystalMaterial()} 
          transparent
          side={THREE.DoubleSide}
        />
      </Sphere>
      
      {/* Inner glow effect */}
      <Sphere args={[1.3, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#81d4fa" 
          transparent 
          opacity={0.1 * stateIntensity} 
        />
      </Sphere>
      
      {/* Outer energy field */}
      {state === 'processing' && (
        <Sphere args={[2.2, 16, 16]} position={[0, 0, 0]}>
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.05} 
            wireframe
          />
        </Sphere>
      )}
    </group>
  );
};

// Mystical base/pedestal for the crystal ball
export const CrystalBase: React.FC = () => {
  const baseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (baseRef.current) {
      // Gentle pulsing glow
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
      baseRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={[0, -2.5, 0]}>
      {/* Base cylinder */}
      <mesh ref={baseRef}>
        <cylinderGeometry args={[0.8, 1.2, 0.3, 32]} />
        <meshPhongMaterial 
          color="#2a1810" 
          emissive="#4a0e4e" 
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Runic circle */}
      <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.1, 32]} />
        <meshBasicMaterial 
          color="#81d4fa" 
          transparent 
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

export default CrystalBall;
