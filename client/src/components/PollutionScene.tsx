import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Sky } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import { usePollution } from "@/lib/stores/usePollution";
import ParticleSystem from "./ParticleSystem";
import { useAudio } from "@/lib/stores/useAudio";
import * as THREE from "three";

// City environment model
const CityEnvironment = ({ timeOfDay }: { timeOfDay: 'day' | 'night' }) => {
  // Rappresentazione della città
  const isDaytime = timeOfDay === 'day';
  
  // Crea un colore del cielo in base all'ora del giorno
  const skyColor = isDaytime ? new THREE.Color("#87CEEB") : new THREE.Color("#0C1445");
  
  // Genera dettagli per gli edifici
  const createWindowPattern = (width: number, height: number, depth: number, color: string) => {
    // Aggiunge pattern finestre
    const material = new THREE.MeshStandardMaterial({ color });
    const buildingGroup = new THREE.Group();
    
    // Building base
    const buildingMesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      material
    );
    buildingGroup.add(buildingMesh);
    
    // Add windows only during night time for light effect
    if (!isDaytime) {
      // Window pattern based on building size
      const windowSize = 0.2;
      const windowSpacing = 0.4;
      const windowsPerRow = Math.floor((width - 0.4) / windowSpacing);
      const windowsPerColumn = Math.floor((height - 1) / windowSpacing); // No windows at the bottom floor
      
      // Create window pattern
      const windowMaterial = new THREE.MeshStandardMaterial({ 
        color: "#FFFDCF", 
        emissive: "#FFFDCF", 
        emissiveIntensity: 0.8 
      });
      
      for (let x = 0; x < windowsPerRow; x++) {
        for (let y = 0; y < windowsPerColumn; y++) {
          // Randomize window lighting (some windows are off)
          if (Math.random() > 0.3) {
            // Window on front face
            const windowMesh = new THREE.Mesh(
              new THREE.PlaneGeometry(windowSize, windowSize),
              windowMaterial
            );
            windowMesh.position.set(
              (x * windowSpacing) - (width / 2) + (windowSize / 2) + (windowSpacing / 2),
              (y * windowSpacing) + (windowSize / 2) + 0.5, // Start from 0.5 height
              depth / 2 + 0.01 // Slightly in front
            );
            buildingGroup.add(windowMesh);
            
            // Window on back face
            const windowMeshBack = windowMesh.clone();
            windowMeshBack.rotation.y = Math.PI;
            windowMeshBack.position.z = -depth / 2 - 0.01;
            buildingGroup.add(windowMeshBack);
            
            // Windows on side faces if building is wide enough
            if (depth > 5) {
              const windowMeshSide = windowMesh.clone();
              windowMeshSide.rotation.y = Math.PI / 2;
              windowMeshSide.position.x = width / 2 + 0.01;
              windowMeshSide.position.z = (x * windowSpacing) - (depth / 2) + windowSize;
              buildingGroup.add(windowMeshSide);
              
              const windowMeshSide2 = windowMesh.clone();
              windowMeshSide2.rotation.y = -Math.PI / 2;
              windowMeshSide2.position.x = -width / 2 - 0.01;
              windowMeshSide2.position.z = (x * windowSpacing) - (depth / 2) + windowSize;
              buildingGroup.add(windowMeshSide2);
            }
          }
        }
      }
    }
    
    return buildingGroup;
  };
  
  return (
    <>
      {/* Piano del terreno con griglia stradale */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      
      {/* Edifici principali (nel centro città) */}
      <group>
        {/* Palazzo centrale - grattacielo principale */}
        <primitive 
          object={createWindowPattern(6, 18, 6, "#334455")} 
          position={[0, 9, -15]}
          castShadow 
          receiveShadow
        />
        
        {/* Edifici del centro */}
        <primitive 
          object={createWindowPattern(5, 12, 5, "#3A4C5F")} 
          position={[-8, 6, -10]}
          castShadow 
          receiveShadow
        />
        
        <primitive 
          object={createWindowPattern(4, 14, 4, "#445566")} 
          position={[7, 7, -12]}
          castShadow 
          receiveShadow
        />
        
        <primitive 
          object={createWindowPattern(8, 6, 8, "#556677")} 
          position={[0, 3, -5]}
          castShadow 
          receiveShadow
        />
        
        {/* Edifici più piccoli intorno */}
        <primitive 
          object={createWindowPattern(3, 8, 3, "#445570")} 
          position={[-12, 4, -18]}
          castShadow 
          receiveShadow
        />
        
        <primitive 
          object={createWindowPattern(4, 10, 4, "#3C4E68")} 
          position={[12, 5, -20]}
          castShadow 
          receiveShadow
        />
        
        {/* Edifici extra aggiunti */}
        <primitive 
          object={createWindowPattern(4, 9, 4, "#506072")} 
          position={[-15, 4.5, -25]}
          castShadow 
          receiveShadow
        />
        
        <primitive 
          object={createWindowPattern(5, 16, 5, "#3E4C5A")} 
          position={[15, 8, -25]}
          castShadow 
          receiveShadow
        />
        
        <primitive 
          object={createWindowPattern(7, 5, 7, "#4A5A6A")} 
          position={[8, 2.5, 2]}
          castShadow 
          receiveShadow
        />
        
        <primitive 
          object={createWindowPattern(6, 7, 6, "#4D5D6D")} 
          position={[-10, 3.5, 0]}
          castShadow 
          receiveShadow
        />
        
        {/* Edifici residenziali più bassi */}
        {Array.from({ length: 20 }).map((_, i) => {
          // Usa posizioni predeterminate per coerenza
          const gridSize = 5; // Distanza tra gli edifici
          const gridX = Math.floor(i / 4) - 2; // Disposizione a griglia
          const gridZ = (i % 4) - 2;
          
          // Posiziona gli edifici in modo da non sovrapporsi a quelli principali
          const posX = gridX * gridSize * 2 + (Math.random() * 2 - 1);
          const posZ = -30 - gridZ * gridSize + (Math.random() * 2 - 1); // Dietro gli edifici principali
          
          // Varia le altezze per un aspetto più realistico
          const height = 3 + Math.floor(Math.random() * 4);
          const width = 2 + Math.random() * 2;
          const depth = 2 + Math.random() * 2;
          
          // Colori variabili per gli edifici residenziali
          const colorHue = 210 + (Math.random() * 20 - 10);
          const colorSat = 10 + Math.random() * 20;
          const colorLight = 30 + Math.random() * 20;
          
          return (
            <primitive 
              key={`residential-${i}`}
              object={createWindowPattern(width, height, depth, `hsl(${colorHue}, ${colorSat}%, ${colorLight}%)`)}
              position={[posX, height/2, posZ]}
              castShadow 
              receiveShadow
            />
          );
        })}
        
        {/* Strade principali */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -15]} receiveShadow>
          <planeGeometry args={[60, 8]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        
        <mesh rotation={[-Math.PI / 2, Math.PI / 2, 0]} position={[0, 0.01, -15]} receiveShadow>
          <planeGeometry args={[60, 8]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        
        {/* Strade secondarie */}
        {[-10, 10].map((offset, i) => (
          <mesh key={`road-h-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[offset, 0.01, -15]} receiveShadow>
            <planeGeometry args={[4, 40]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
        ))}
        
        {[-25, -5, 5].map((offset, i) => (
          <mesh key={`road-v-${i}`} rotation={[-Math.PI / 2, Math.PI / 2, 0]} position={[0, 0.01, offset]} receiveShadow>
            <planeGeometry args={[4, 50]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
        ))}
      </group>
      
      {/* Cielo e illuminazione */}
      <Sky
        distance={450000}
        sunPosition={isDaytime ? [0, 1, 0] : [0, -1, 0]}
        inclination={isDaytime ? 0.5 : 0.15}
        azimuth={0.25}
      />
      
      {/* Luce ambientale */}
      <ambientLight intensity={isDaytime ? 0.5 : 0.1} />
      
      {/* Luce direzionale che rappresenta il sole o la luna */}
      <directionalLight
        position={isDaytime ? [10, 20, 10] : [-10, 10, -10]}
        intensity={isDaytime ? 1.0 : 0.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      
      {/* Aggiungi alcune luci stradali di notte */}
      {!isDaytime && (
        <>
          {/* Luci stradali principali */}
          {[[-10, -15], [10, -15], [0, -5], [0, -25], [-20, -15], [20, -15]].map(([x, z], i) => (
            <pointLight key={`streetlight-${i}`} position={[x, 3, z]} intensity={0.8} distance={15} color="#FFF5E0" />
          ))}
          
          {/* Luci ambientali sparse */}
          {Array.from({ length: 8 }).map((_, i) => {
            const posX = (Math.random() * 40 - 20);
            const posZ = -5 - (Math.random() * 30);
            return (
              <pointLight 
                key={`ambientlight-${i}`} 
                position={[posX, 1 + Math.random() * 2, posZ]} 
                intensity={0.4} 
                distance={8} 
                color={Math.random() > 0.7 ? "#FFF5E0" : "#FFE0CC"} 
              />
            );
          })}
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
