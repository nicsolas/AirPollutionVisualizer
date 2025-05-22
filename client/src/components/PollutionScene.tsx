import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Sky } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import { usePollution } from "@/lib/stores/usePollution";
import ParticleSystem from "./ParticleSystem";
import { useAudio } from "@/lib/stores/useAudio";
import * as THREE from "three";

// City environment model
const CityEnvironment = ({ timeOfDay }: { timeOfDay: 'day' | 'night' }) => {
  // Simple city representation
  const isDaytime = timeOfDay === 'day';
  
  return (
    <>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      
      {/* Buildings (just simple boxes) */}
      <group>
        {/* Center buildings */}
        <mesh position={[-5, 2, -10]} castShadow receiveShadow>
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial color="#334455" />
        </mesh>
        
        <mesh position={[3, 3.5, -8]} castShadow receiveShadow>
          <boxGeometry args={[3, 7, 3]} />
          <meshStandardMaterial color="#445566" />
        </mesh>
        
        <mesh position={[0, 5, -15]} castShadow receiveShadow>
          <boxGeometry args={[4, 10, 4]} />
          <meshStandardMaterial color="#556677" />
        </mesh>
        
        {/* Surrounding buildings */}
        {Array.from({ length: 15 }).map((_, i) => {
          // Use predetermined positions rather than random for consistency
          const posX = [12, -10, 8, -15, 18, -5, 14, -20, 24, -18, 6, -8, 20, -12, 16][i];
          const posZ = [-20, -18, -25, -30, -15, -22, -33, -14, -26, -35, -16, -28, -12, -24, -10][i];
          const height = [3, 6, 8, 4, 7, 9, 5, 8, 3, 6, 4, 7, 5, 9, 4][i];
          
          return (
            <mesh 
              key={i} 
              position={[posX, height / 2, posZ]} 
              castShadow 
              receiveShadow
            >
              <boxGeometry args={[3, height, 3]} />
              <meshStandardMaterial 
                color={`hsl(210, ${10 + i * 2}%, ${30 + i * 2}%)`} 
              />
            </mesh>
          );
        })}
        
        {/* Roads */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -14]} receiveShadow>
          <planeGeometry args={[40, 5]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        
        <mesh rotation={[-Math.PI / 2, Math.PI / 2, 0]} position={[0, 0.01, -14]} receiveShadow>
          <planeGeometry args={[40, 5]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>
      
      {/* Sky and lighting */}
      <Sky
        distance={450000}
        sunPosition={isDaytime ? [0, 1, 0] : [0, -1, 0]}
        inclination={isDaytime ? 0.5 : 0.15}
        azimuth={0.25}
      />
      
      {/* Ambient light */}
      <ambientLight intensity={isDaytime ? 0.5 : 0.1} />
      
      {/* Directional light representing the sun or moon */}
      <directionalLight
        position={isDaytime ? [10, 20, 10] : [-10, 10, -10]}
        intensity={isDaytime ? 1.0 : 0.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Add some street lights at night */}
      {!isDaytime && (
        <>
          <pointLight position={[5, 2, -12]} intensity={1} distance={15} color="#FFF5E0" />
          <pointLight position={[-5, 2, -15]} intensity={1} distance={15} color="#FFF5E0" />
          <pointLight position={[0, 2, -20]} intensity={1} distance={15} color="#FFF5E0" />
        </>
      )}
    </>
  );
};

// Room environment model
const RoomEnvironment = ({ timeOfDay }: { timeOfDay: 'day' | 'night' }) => {
  const isDaytime = timeOfDay === 'day';
  
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#964B00" roughness={0.8} />
      </mesh>
      
      {/* Walls */}
      {/* Back wall */}
      <mesh position={[0, 2, -5]} receiveShadow>
        <boxGeometry args={[10, 4, 0.2]} />
        <meshStandardMaterial color="#F5F5F5" />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 4, 0.2]} />
        <meshStandardMaterial color="#EEEEEE" />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[5, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 4, 0.2]} />
        <meshStandardMaterial color="#EEEEEE" />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Window */}
      <mesh position={[0, 2, -4.9]} receiveShadow>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial 
          color={isDaytime ? "#87CEEB" : "#001428"} 
          emissive={isDaytime ? "#000000" : "#001428"}
          emissiveIntensity={isDaytime ? 0 : 0.2}
        />
      </mesh>
      
      {/* Table */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.1, 2]} />
        <meshStandardMaterial color="#5D4037" roughness={0.7} />
      </mesh>
      
      {/* Table legs */}
      {[
        [1.4, 0.4, 0.9],
        [1.4, 0.4, -0.9],
        [-1.4, 0.4, 0.9],
        [-1.4, 0.4, -0.9]
      ].map((position, i) => (
        <mesh key={i} position={position} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshStandardMaterial color="#3E2723" />
        </mesh>
      ))}
      
      {/* Lighting */}
      <ambientLight intensity={isDaytime ? 0.7 : 0.2} />
      
      {/* Window light */}
      <directionalLight
        position={[0, 2, -4]}
        intensity={isDaytime ? 0.8 : 0.1}
        castShadow
      />
      
      {/* Room light */}
      {!isDaytime && (
        <pointLight position={[0, 3.5, 0]} intensity={0.8} distance={10} color="#FFF5E0" />
      )}
    </>
  );
};

const PollutionScene = () => {
  const { visualizationSettings, cityData, selectedPollutant } = usePollution();
  const { playHit } = useAudio();
  const controlsRef = useRef<any>(null);
  
  // Determine concentration level from city data
  const pollutionLevel = cityData?.data.pollutants[selectedPollutant]?.value || 50;
  
  // Normalize to a 0-1 scale for visualization intensity
  const normalizedLevel = Math.min(1.0, pollutionLevel / 100);
  
  // Adjust particle count based on density setting and pollution level
  const particleCount = Math.floor(
    200 * (visualizationSettings.density / 100) * (0.5 + normalizedLevel)
  );
  
  // Set camera position based on view mode
  useEffect(() => {
    if (!controlsRef.current) return;
    
    if (visualizationSettings.viewMode === 'city') {
      controlsRef.current.object.position.set(15, 15, 15);
      controlsRef.current.target.set(0, 0, -10);
    } else {
      controlsRef.current.object.position.set(0, 2, 3);
      controlsRef.current.target.set(0, 1, 0);
    }
    
    controlsRef.current.update();
  }, [visualizationSettings.viewMode]);
  
  // Play sound on significant pollution level change
  useEffect(() => {
    // Only play when we have real data
    if (cityData) {
      playHit();
    }
  }, [selectedPollutant, cityData, playHit]);
  
  return (
    <div className="h-full w-full">
      <Canvas shadows camera={{ position: [15, 15, 15], fov: 50 }}>
        <Suspense fallback={null}>
          {visualizationSettings.viewMode === 'city' ? (
            <CityEnvironment timeOfDay={visualizationSettings.timeOfDay} />
          ) : (
            <RoomEnvironment timeOfDay={visualizationSettings.timeOfDay} />
          )}
          
          <ParticleSystem 
            count={particleCount}
            size={visualizationSettings.particleSize}
            speed={visualizationSettings.particleSpeed}
            pollutant={selectedPollutant}
            concentration={normalizedLevel}
          />
          
          <OrbitControls 
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={50}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PollutionScene;
