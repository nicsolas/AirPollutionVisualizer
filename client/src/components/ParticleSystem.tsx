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
  
  // Get color based on pollutant type
  const color = pollutantColors[pollutant];
  
  // Convert hex color to RGB
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
  
  // Create particles with pre-calculated positions and velocities
  const [positions, velocities, bounds] = useMemo(() => {
    // Determine bounds based on pollutant type
    const bounds = {
      x: pollutant === PollutantType.PM25 || pollutant === PollutantType.PM10 ? 10 : 8,
      y: 5,
      z: pollutant === PollutantType.O3 ? 10 : 8
    };
    
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Different distributions for different pollutants
      if (pollutant === PollutantType.PM25 || pollutant === PollutantType.PM10) {
        // Ground-level concentrated particles
        positions[i3] = (Math.random() * 2 - 1) * bounds.x;
        positions[i3 + 1] = Math.random() * bounds.y * 0.7;
        positions[i3 + 2] = (Math.random() * 2 - 1) * bounds.z;
      } else if (pollutant === PollutantType.O3) {
        // Higher altitude ozone
        positions[i3] = (Math.random() * 2 - 1) * bounds.x;
        positions[i3 + 1] = Math.random() * bounds.y + bounds.y * 0.3;
        positions[i3 + 2] = (Math.random() * 2 - 1) * bounds.z;
      } else {
        // Other gases more evenly distributed
        positions[i3] = (Math.random() * 2 - 1) * bounds.x;
        positions[i3 + 1] = Math.random() * bounds.y;
        positions[i3 + 2] = (Math.random() * 2 - 1) * bounds.z;
      }
      
      // Random initial velocities with pollutant-specific characteristics
      velocities[i3] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] = Math.random() * 0.01 * (pollutant === PollutantType.PM25 ? 0.5 : 1);
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    
    return [positions, velocities, bounds];
  }, [count, pollutant]);
  
  // Set up initial attributes
  const geom = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    positionAttrib.current = posAttr;
    
    const velAttr = new THREE.BufferAttribute(velocities, 3);
    velocityAttrib.current = velAttr;
    
    return geometry;
  }, [positions, velocities]);
  
  // Animate particles
  useFrame((state, delta) => {
    if (!particles.current) return;
    
    const positions = positionAttrib.current.array as Float32Array;
    const velocities = velocityAttrib.current.array as Float32Array;
    
    // Apply a time-based factor to simulate wind or air currents
    const time = state.clock.getElapsedTime();
    const windX = Math.sin(time * 0.2) * 0.0005 * speed;
    const windZ = Math.cos(time * 0.15) * 0.0003 * speed;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Add some randomness and apply velocity
      velocities[i3] += (Math.random() - 0.5) * 0.0002 * speed + windX;
      velocities[i3 + 1] += (Math.random() - 0.5) * 0.0001 * speed;
      velocities[i3 + 2] += (Math.random() - 0.5) * 0.0002 * speed + windZ;
      
      // Apply friction/drag to dampen motion
      velocities[i3] *= 0.99;
      velocities[i3 + 1] *= 0.99;
      velocities[i3 + 2] *= 0.99;
      
      // Update position based on velocity and concentration
      positions[i3] += velocities[i3] * delta * 60 * speed;
      positions[i3 + 1] += velocities[i3 + 1] * delta * 60 * speed;
      positions[i3 + 2] += velocities[i3 + 2] * delta * 60 * speed;
      
      // Boundary checks
      if (positions[i3] < -bounds.x || positions[i3] > bounds.x) {
        positions[i3] = Math.sign(positions[i3]) * bounds.x;
        velocities[i3] *= -0.5;
      }
      
      if (positions[i3 + 1] < 0) {
        // For PM particles, they can rest near ground
        if (pollutant === PollutantType.PM25 || pollutant === PollutantType.PM10) {
          positions[i3 + 1] = 0;
          velocities[i3 + 1] = Math.abs(velocities[i3 + 1]) * 0.2;
        } else {
          positions[i3 + 1] = 0;
          velocities[i3 + 1] *= -0.5;
        }
      } else if (positions[i3 + 1] > bounds.y) {
        positions[i3 + 1] = bounds.y;
        velocities[i3 + 1] *= -0.5;
      }
      
      if (positions[i3 + 2] < -bounds.z || positions[i3 + 2] > bounds.z) {
        positions[i3 + 2] = Math.sign(positions[i3 + 2]) * bounds.z;
        velocities[i3 + 2] *= -0.5;
      }
    }
    
    positionAttrib.current.needsUpdate = true;
  });
  
  // Scaling factor based on concentration
  const scaleFactor = 0.5 + concentration * 0.5;
  
  return (
    <points ref={particles} frustumCulled={false}>
      <bufferGeometry {...geom} />
      <pointsMaterial
        size={size * scaleFactor}
        color={new THREE.Color(particleColor.r, particleColor.g, particleColor.b)}
        opacity={0.6 + concentration * 0.4}
        transparent={true}
        depthWrite={false}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleSystem;
