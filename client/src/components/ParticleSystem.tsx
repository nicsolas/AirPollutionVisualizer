import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PollutantType } from "@/lib/types";
import { pollutantColors } from "@/lib/utils/colors";

interface ParticleSystemProps {
  count: number;
  size: number;
  speed: number;
  pollutant: PollutantType;
  concentration: number;
}

const ParticleSystem = ({ count, size, speed, pollutant, concentration }: ParticleSystemProps) => {
  const particles = useRef<THREE.Points>(null!);
  const positionAttrib = useRef<THREE.BufferAttribute>(null!);
  const velocityAttrib = useRef<THREE.BufferAttribute>(null!);
  
  // Ottiene il colore in base al tipo di inquinante
  const color = pollutantColors[pollutant];
  
  // Converte il colore esadecimale in RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255
        } 
      : { r: 1, g: 1, b: 1 };
  };
  
  const particleColor = hexToRgb(color);
  
  // Crea particelle con posizioni e velocità pre-calcolate
  const [positions, velocities, bounds] = useMemo(() => {
    // Determina i limiti in base al tipo di inquinante - area estesa per tutta la città
    const bounds = {
      x: pollutant === PollutantType.PM25 || pollutant === PollutantType.PM10 ? 20 : 18,
      y: 10, // Altezza aumentata
      z: pollutant === PollutantType.O3 ? 20 : 18
    };
    
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    // Funzione per posizionare particelle in modo più distribuito
    const randomPositionInArea = (areaWidth: number, areaHeight: number, areaDepth: number) => {
      const x = (Math.random() * 2 - 1) * areaWidth;
      const y = Math.random() * areaHeight;
      const z = (Math.random() * 2 - 1) * areaDepth;
      
      // Posiziona alcune particelle intorno agli edifici
      const nearBuilding = Math.random() < 0.3;
      if (nearBuilding) {
        // Crea cluster di particelle intorno ad edifici immaginari
        const buildingX = Math.floor(Math.random() * 5 - 2.5) * 4; // 5 edifici lungo x
        const buildingZ = Math.floor(Math.random() * 5 - 2.5) * 4; // 5 edifici lungo z
        
        // Posizione vicino all'edificio ma non all'interno
        return [
          buildingX + (Math.random() * 4 - 2),
          y * 0.8, // Più vicino al terreno intorno agli edifici
          buildingZ + (Math.random() * 4 - 2)
        ];
      }
      
      return [x, y, z];
    };
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let particlePos;
      
      // Distribuzioni diverse per diversi inquinanti
      if (pollutant === PollutantType.PM25 || pollutant === PollutantType.PM10) {
        // Particelle concentrate a livello del suolo
        particlePos = randomPositionInArea(bounds.x, bounds.y * 0.7, bounds.z);
      } else if (pollutant === PollutantType.O3) {
        // Ozono ad altitudine superiore
        particlePos = randomPositionInArea(bounds.x, bounds.y, bounds.z);
        particlePos[1] += bounds.y * 0.3; // Più in alto
      } else {
        // Altri gas distribuiti più uniformemente
        particlePos = randomPositionInArea(bounds.x, bounds.y, bounds.z);
      }
      
      positions[i3] = particlePos[0];
      positions[i3 + 1] = particlePos[1];
      positions[i3 + 2] = particlePos[2];
      
      // Velocità iniziali casuali con caratteristiche specifiche per inquinante
      const speedFactor = pollutant === PollutantType.PM25 ? 0.5 : 
                         (pollutant === PollutantType.PM10 ? 0.7 : 1);
                         
      velocities[i3] = (Math.random() - 0.5) * 0.01 * speedFactor;
      velocities[i3 + 1] = Math.random() * 0.01 * speedFactor;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01 * speedFactor;
    }
    
    return [positions, velocities, bounds];
  }, [count, pollutant]);
  
  // Imposta gli attributi iniziali
  const geom = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    positionAttrib.current = posAttr;
    
    const velAttr = new THREE.BufferAttribute(velocities, 3);
    velocityAttrib.current = velAttr;
    
    return geometry;
  }, [positions, velocities]);
  
  // Anima le particelle
  useFrame((state, delta) => {
    if (!particles.current) return;
    
    const positions = positionAttrib.current.array as Float32Array;
    const velocities = velocityAttrib.current.array as Float32Array;
    
    // Applica un fattore basato sul tempo per simulare correnti d'aria
    const time = state.clock.getElapsedTime();
    // Venti più complessi
    const windX = Math.sin(time * 0.2) * 0.0005 * speed + Math.sin(time * 0.5 + 1.3) * 0.0003 * speed;
    const windY = Math.sin(time * 0.15 + 0.7) * 0.0001 * speed;
    const windZ = Math.cos(time * 0.15) * 0.0003 * speed + Math.cos(time * 0.4 + 2.1) * 0.0002 * speed;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Più casualità dinamica basata sulla posizione per creare vortici e correnti
      const posX = positions[i3];
      const posY = positions[i3 + 1];
      const posZ = positions[i3 + 2];
      
      // Aggiungi turbolenza che dipende dalla posizione
      const turbulenceX = Math.sin(posZ * 0.1 + time * 0.2) * 0.0001 * speed;
      const turbulenceY = Math.cos(posX * 0.1 + time * 0.1) * 0.0001 * speed;
      const turbulenceZ = Math.sin(posY * 0.1 + posX * 0.1 + time * 0.3) * 0.0001 * speed;
      
      // Aggiungi casualità e applica velocità
      velocities[i3] += (Math.random() - 0.5) * 0.0002 * speed + windX + turbulenceX;
      velocities[i3 + 1] += (Math.random() - 0.5) * 0.0001 * speed + windY + turbulenceY;
      velocities[i3 + 2] += (Math.random() - 0.5) * 0.0002 * speed + windZ + turbulenceZ;
      
      // Applica attrito/resistenza per smorzare il movimento
      const drag = pollutant === PollutantType.PM10 ? 0.97 : 
                 (pollutant === PollutantType.PM25 ? 0.98 : 0.99);
                 
      velocities[i3] *= drag;
      velocities[i3 + 1] *= drag;
      velocities[i3 + 2] *= drag;
      
      // Aggiorna la posizione in base a velocità e concentrazione
      const speedMultiplier = 1 + concentration * 0.2; // L'alta concentrazione aumenta un po' la velocità
      positions[i3] += velocities[i3] * delta * 60 * speed * speedMultiplier;
      positions[i3 + 1] += velocities[i3 + 1] * delta * 60 * speed * speedMultiplier;
      positions[i3 + 2] += velocities[i3 + 2] * delta * 60 * speed * speedMultiplier;
      
      // Controlli dei confini con meccanismo di reinserimento
      if (positions[i3] < -bounds.x || positions[i3] > bounds.x) {
        // Riposiziona sul lato opposto con velocità ridotta
        positions[i3] = -Math.sign(positions[i3]) * bounds.x * 0.9;
        velocities[i3] *= 0.2;
      }
      
      if (positions[i3 + 1] < 0) {
        // Per le particelle di PM, possono rimanere vicino al suolo
        if (pollutant === PollutantType.PM25 || pollutant === PollutantType.PM10) {
          positions[i3 + 1] = 0.1;
          velocities[i3 + 1] = Math.abs(velocities[i3 + 1]) * 0.1;
        } else {
          positions[i3 + 1] = 0.1;
          velocities[i3 + 1] *= -0.5;
        }
      } else if (positions[i3 + 1] > bounds.y) {
        if (pollutant === PollutantType.O3) {
          // L'ozono tende a rimanere in alto
          positions[i3 + 1] = bounds.y * 0.9;
          velocities[i3 + 1] *= -0.2;
        } else {
          positions[i3 + 1] = bounds.y * 0.9;
          velocities[i3 + 1] *= -0.5;
        }
      }
      
      if (positions[i3 + 2] < -bounds.z || positions[i3 + 2] > bounds.z) {
        // Riposiziona sul lato opposto
        positions[i3 + 2] = -Math.sign(positions[i3 + 2]) * bounds.z * 0.9;
        velocities[i3 + 2] *= 0.2;
      }
    }
    
    positionAttrib.current.needsUpdate = true;
  });
  
  // Fattore di scala basato sulla concentrazione
  const scaleFactor = 0.6 + concentration * 0.6;
  
  // Calcola l'opacità in base alla concentrazione
  const opacityFactor = 0.5 + concentration * 0.5;
  
  return (
    <points ref={particles} frustumCulled={false}>
      <bufferGeometry {...geom} />
      <pointsMaterial
        size={size * scaleFactor}
        color={new THREE.Color(particleColor.r, particleColor.g, particleColor.b)}
        opacity={opacityFactor}
        transparent={true}
        depthWrite={false}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleSystem;
