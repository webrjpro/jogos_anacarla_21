import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = ({ position, color, geometry }: { position: [number, number, number], color: string, geometry: 'box' | 'sphere' | 'torus' | 'octahedron' }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
      
      // Subtle parallax effect based on mouse movement
      const targetX = (state.pointer.x * 2);
      const targetY = (state.pointer.y * 2);
      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.02;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.02;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2} position={position}>
      <mesh ref={meshRef}>
        {geometry === 'box' && <boxGeometry args={[1, 1, 1]} />}
        {geometry === 'sphere' && <sphereGeometry args={[0.7, 32, 32]} />}
        {geometry === 'torus' && <torusGeometry args={[0.6, 0.2, 16, 100]} />}
        {geometry === 'octahedron' && <octahedronGeometry args={[0.8, 0]} />}
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.5} 
          wireframe={Math.random() > 0.5} 
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
};

export const Background3D: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-background pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#00e5ff" intensity={2} />
        <pointLight position={[-10, -10, 10]} color="#e040fb" intensity={2} />
        
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        
        <FloatingShape position={[-5, 3, -5]} color="#00e5ff" geometry="torus" />
        <FloatingShape position={[6, -2, -8]} color="#e040fb" geometry="octahedron" />
        <FloatingShape position={[-4, -4, -6]} color="#00e676" geometry="sphere" />
        <FloatingShape position={[5, 4, -4]} color="#ffd600" geometry="box" />
        <FloatingShape position={[0, 5, -10]} color="#ff9100" geometry="torus" />
        <FloatingShape position={[-6, 0, -3]} color="#ff1744" geometry="octahedron" />
      </Canvas>
    </div>
  );
};
