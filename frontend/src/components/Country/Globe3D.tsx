import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

interface CountryMarker {
  name: string;
  flag: string;
  lat: number;
  lng: number;
  color: string;
  id: string;
  score: string;
}

const POPULAR_COUNTRIES: CountryMarker[] = [
  { id: '1', name: 'Canada', flag: '🇨🇦', lat: 56.1304, lng: -106.3468, color: '#38bdf8', score: '95%' },
  { id: '2', name: 'Germany', flag: '🇩🇪', lat: 51.1657, lng: 10.4515, color: '#a78bfa', score: '92%' },
  { id: '3', name: 'Australia', flag: '🇦🇺', lat: -25.2744, lng: 133.7751, color: '#f472b6', score: '88%' },
  { id: '4', name: 'United Kingdom', flag: '🇬🇧', lat: 55.3781, lng: -3.4360, color: '#34d399', score: '90%' },
  { id: '5', name: 'United States', flag: '🇺🇸', lat: 37.0902, lng: -95.7129, color: '#f59e0b', score: '94%' },
  { id: '6', name: 'Japan', flag: '🇯🇵', lat: 36.2048, lng: 138.2529, color: '#f43f5e', score: '85%' },
  { id: '7', name: 'Sweden', flag: '🇸🇪', lat: 60.1282, lng: 18.6435, color: '#06b6d4', score: '87%' },
  { id: '8', name: 'Finland', flag: '🇫🇮', lat: 61.9241, lng: 25.7482, color: '#10b981', score: '89%' }
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);

  return new THREE.Vector3(x, y, z);
}

function Earth({ onHoverCountry, onClickCountry }: {
  onHoverCountry: (country: CountryMarker | null) => void;
  onClickCountry: (country: CountryMarker) => void;
}) {
  const earthRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.07;
    }
  });

  return (
    <group ref={earthRef}>
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#2c69ff"
          emissiveIntensity={0.24}
          roughness={0.4}
          metalness={0.12}
        />
      </mesh>

      <mesh scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.46, 0.02, 16, 120]} />
        <meshBasicMaterial color="#6d28d9" transparent opacity={0.16} />
      </mesh>

      {POPULAR_COUNTRIES.map((c) => {
        const pos = latLngToVector3(c.lat, c.lng, 2.05);
        return (
          <group key={c.id} position={pos}>
            <MarkerPoint
              country={c}
              onHover={onHoverCountry}
              onClick={onClickCountry}
            />
          </group>
        );
      })}
    </group>
  );
}

function MarkerPoint({
  country,
  onHover,
  onClick
}: {
  country: CountryMarker;
  onHover: (c: CountryMarker | null) => void;
  onClick: (c: CountryMarker) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 6) * 0.18;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(country);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(country);
      }}
    >
      <sphereGeometry args={[0.065, 16, 16]} />
      <meshStandardMaterial color={hovered ? '#ffffff' : country.color} emissive={hovered ? '#ffffff' : country.color} emissiveIntensity={hovered ? 0.8 : 0.3} />
      <mesh scale={[1.8, 1.8, 1.8]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={country.color} transparent opacity={0.25} />
      </mesh>
    </mesh>
  );
}

export default function Globe3D() {
  const [hoveredCountry, setHoveredCountry] = useState<CountryMarker | null>(null);
  const navigate = useNavigate();

  const handleCountryClick = () => {
    navigate(`/countries`);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden rounded-3xl glass-panel border border-white/5 bg-black/20">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }} className="w-full h-full">
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 3, 5]} intensity={1.4} />
        <pointLight position={[-5, -3, -5]} intensity={0.45} color="#7c3aed" />
        <Stars radius={120} depth={60} count={1200} factor={3} saturation={0.4} fade speed={1} />
        <Earth
          onHoverCountry={setHoveredCountry}
          onClickCountry={handleCountryClick}
        />
        <OrbitControls
          enableZoom={true}
          zoomSpeed={0.5}
          enablePan={false}
          minDistance={3}
          maxDistance={6}
          autoRotate={!hoveredCountry}
          autoRotateSpeed={0.3}
        />
      </Canvas>

      {hoveredCountry && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel px-5 py-3 border border-white/10 flex items-center gap-3 backdrop-blur-xl animate-fade-in pointer-events-none">
          <span className="text-2xl">{hoveredCountry.flag}</span>
          <div>
            <p className="text-sm font-bold text-white leading-none">{hoveredCountry.name}</p>
            <p className="text-[10px] text-cyan-400 font-semibold tracking-wider mt-1 uppercase">Match Score: {hoveredCountry.score}</p>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 glass-panel p-3 border border-white/5 pointer-events-none hidden sm:block">
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Drag to rotate earth</p>
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Click markers to explore</p>
      </div>
    </div>
  );
}
