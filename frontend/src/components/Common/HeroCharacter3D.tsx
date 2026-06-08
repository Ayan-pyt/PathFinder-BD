import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function WavingCharacter() {
  const groupRef = useRef<THREE.Group>(null!);
  const armRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(elapsed * 0.4) * 0.08;
    }
    if (armRef.current) {
      armRef.current.rotation.z = Math.sin(elapsed * 2.5) * 0.55 - 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.5, 48, 48]} />
        <meshStandardMaterial color="#f8b195" metalness={0.2} roughness={0.5} />
      </mesh>

      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.45, 0.5, 0.9, 32]} />
        <meshStandardMaterial color="#6c5ce7" metalness={0.22} roughness={0.35} />
      </mesh>

      <mesh position={[-0.65, 0.55, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.12, 0.12, 0.9, 24]} />
        <meshStandardMaterial color="#6c5ce7" />
      </mesh>

      <group ref={armRef} position={[0.75, 0.7, 0]} rotation={[0, 0, -0.4]}>
        <mesh position={[0, -0.35, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.9, 24]} />
          <meshStandardMaterial color="#6c5ce7" />
        </mesh>
        <mesh position={[0, -0.95, 0]}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial color="#f8b195" />
        </mesh>
      </group>

      <mesh position={[-0.18, 2.05, 0.25]}> 
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0.35, 2.1, -0.15]}> 
        <sphereGeometry args={[0.05, 20, 20]} />
        <meshStandardMaterial color="#8de9ff" emissive="#8de9ff" emissiveIntensity={0.65} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function FloatingOrb() {
  const orbRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (orbRef.current) {
      orbRef.current.position.x = Math.cos(clock.getElapsedTime() * 0.9) * 1.35;
      orbRef.current.position.z = Math.sin(clock.getElapsedTime() * 0.9) * 0.9;
      orbRef.current.position.y = 1.35 + Math.sin(clock.getElapsedTime() * 1.5) * 0.15;
    }
  });

  return (
    <mesh ref={orbRef}>
      <sphereGeometry args={[0.18, 32, 32]} />
      <meshStandardMaterial color="#3b82f6" emissive="#60a5fa" emissiveIntensity={1} transparent opacity={0.85} />
    </mesh>
  );
}

export default function HeroCharacter3D() {
  return (
    <div className="relative w-full h-[520px] md:h-[560px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
      <Canvas camera={{ position: [0, 0.8, 5], fov: 40 }} className="w-full h-full">
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 3, -2]} intensity={0.65} color="#5b21b6" />
        <spotLight position={[0, 5, 5]} angle={0.35} penumbra={0.4} intensity={1.2} castShadow />
        <WavingCharacter />
        <FloatingOrb />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]}> 
          <planeGeometry args={[8, 8]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={0.75} />
        </mesh>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35} />
      </Canvas>
      <div className="absolute left-6 top-6 rounded-3xl bg-slate-950/80 border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 backdrop-blur-xl">
        Interactive 3D companion
      </div>
    </div>
  );
}
