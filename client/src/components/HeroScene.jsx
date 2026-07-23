import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

function AnimatedSphere({ position, color, speed = 1, distort = 0.4, scale = 1 }) {
  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.8}>
      <Sphere args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </Sphere>
    </Float>
  );
}

function Ring({ position }) {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * 0.3;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[1.5, 0.05, 16, 100]} />
      <meshStandardMaterial color="#8b5cf6" transparent opacity={0.3} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#a78bfa" />
        <pointLight position={[-5, -5, 5]} intensity={1} color="#818cf8" />
        <AnimatedSphere position={[-3, 0.5, 0]} color="#7c3aed" speed={1.5} distort={0.5} scale={1.2} />
        <AnimatedSphere position={[3, -0.5, -1]} color="#4f46e5" speed={1} distort={0.3} scale={0.8} />
        <AnimatedSphere position={[0, 1, -2]} color="#9333ea" speed={2} distort={0.6} scale={0.6} />
        <Ring position={[2, 1, -1]} />
        <Ring position={[-2, -1, -2]} />
      </Canvas>
    </div>
  );
}
