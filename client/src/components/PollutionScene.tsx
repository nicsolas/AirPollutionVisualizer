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
  const createWindowPattern = (width: number, height: number, depth: number, color: string, style: 'modern' | 'classic' | 'industrial' = 'modern') => {
    // Aggiunge pattern finestre
    const material = new THREE.MeshStandardMaterial({ 
      color,
      roughness: 0.7,
      metalness: style === 'modern' ? 0.6 : 0.2
    });
    
    const buildingGroup = new THREE.Group();
    
    // Building base with bevel for more realistic look
    let buildingGeometry;
    if (style === 'modern') {
      // For modern buildings, use box geometry with glass-like material
      buildingGeometry = new THREE.BoxGeometry(width, height, depth);
      buildingGroup.add(new THREE.Mesh(
        buildingGeometry,
        material
      ));
      
      // Add glass panels for modern buildings
      if (height > 8) {
        const glassMaterial = new THREE.MeshStandardMaterial({
          color: isDaytime ? '#A7C4E5' : '#1A2C3D',
          roughness: 0.1,
          metalness: 0.8,
          transparent: true,
          opacity: 0.7,
          envMapIntensity: 1.5
        });
        
        // Glass facade on taller buildings
        const glassWidth = width * 0.8;
        const glassHeight = height * 0.7;
        const glassDepth = depth * 0.8;
        
        const glassMesh = new THREE.Mesh(
          new THREE.BoxGeometry(glassWidth, glassHeight, glassDepth),
          glassMaterial
        );
        
        glassMesh.position.y = height * 0.15;
        buildingGroup.add(glassMesh);
      }
    } else if (style === 'classic') {
      // For classic buildings, add details like cornices and columns
      buildingGeometry = new THREE.BoxGeometry(width, height, depth);
      buildingGroup.add(new THREE.Mesh(
        buildingGeometry,
        material
      ));
      
      // Add cornice at the top
      const corniceMaterial = new THREE.MeshStandardMaterial({
        color: '#CDCDCD',
        roughness: 0.8
      });
      
      const corniceHeight = 0.3;
      const corniceMesh = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.3, corniceHeight, depth + 0.3),
        corniceMaterial
      );
      
      corniceMesh.position.y = height / 2 - corniceHeight / 2;
      buildingGroup.add(corniceMesh);
      
      // Add base/foundation
      const baseMesh = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.2, 0.5, depth + 0.2),
        new THREE.MeshStandardMaterial({ color: '#555555', roughness: 0.9 })
      );
      
      baseMesh.position.y = -height / 2 + 0.25;
      buildingGroup.add(baseMesh);
    } else if (style === 'industrial') {
      // For industrial buildings, more rectangular with details
      buildingGeometry = new THREE.BoxGeometry(width, height, depth);
      buildingGroup.add(new THREE.Mesh(
        buildingGeometry,
        material
      ));
      
      // Add roof structures for industrial buildings
      const roofMaterial = new THREE.MeshStandardMaterial({
        color: '#444444',
        roughness: 0.9
      });
      
      // Create pitched roof
      if (width > 5) {
        const roofHeight = 1.2;
        const roofMesh = new THREE.Mesh(
          new THREE.ConeGeometry(width/2, roofHeight, 4),
          roofMaterial
        );
        
        roofMesh.rotation.y = Math.PI / 4;
        roofMesh.position.y = height / 2 + roofHeight / 2;
        buildingGroup.add(roofMesh);
      }
    }
    
    // Add windows for all building types
    const addWindows = () => {
      // Window pattern based on building style and size
      const windowSize = style === 'modern' ? 0.3 : 0.2;
      const windowSpacing = style === 'modern' ? 0.5 : 0.4;
      const windowDepth = 0.05;
      
      // Calculate window arrangement
      const windowsPerRow = Math.floor((width - 0.4) / windowSpacing);
      const windowsPerColumn = Math.floor((height - 1) / windowSpacing);
      
      // Create window materials
      const windowMaterial = new THREE.MeshStandardMaterial({ 
        color: isDaytime ? "#E8F4FF" : "#FFFDCF", 
        emissive: isDaytime ? "#FFFFFF" : "#FFFDCF", 
        emissiveIntensity: isDaytime ? 0.1 : 0.8,
        roughness: 0.1,
        metalness: 0.5
      });
      
      // Window frame material
      const frameMaterial = new THREE.MeshStandardMaterial({
        color: style === 'modern' ? "#444444" : "#8B4513",
        roughness: 0.8
      });
      
      for (let x = 0; x < windowsPerRow; x++) {
        for (let y = 0; y < windowsPerColumn; y++) {
          // Randomize window presence (some areas don't have windows)
          if (Math.random() > (style === 'industrial' ? 0.7 : 0.2)) {
            // Window frame first (slightly bigger than the window)
            const frameSize = windowSize + 0.05;
            
            // Front face windows
            const windowGroup = new THREE.Group();
            
            // Frame
            const frame = new THREE.Mesh(
              new THREE.BoxGeometry(frameSize, frameSize, windowDepth),
              frameMaterial
            );
            windowGroup.add(frame);
            
            // Window glass (only if it's not turned off)
            if (isDaytime || Math.random() > 0.3) {
              const glass = new THREE.Mesh(
                new THREE.PlaneGeometry(windowSize, windowSize),
                windowMaterial
              );
              glass.position.z = windowDepth / 2 + 0.001;
              windowGroup.add(glass);
            }
            
            // Position the window
            windowGroup.position.set(
              (x * windowSpacing) - (width / 2) + (windowSize / 2) + (windowSpacing / 2),
              (y * windowSpacing) + (windowSize / 2) + 0.5, // Start from 0.5 height
              depth / 2 + 0.01 // Slightly in front
            );
            
            buildingGroup.add(windowGroup);
            
            // Back side windows
            const windowGroupBack = windowGroup.clone();
            windowGroupBack.rotation.y = Math.PI;
            windowGroupBack.position.z = -depth / 2 - 0.01;
            buildingGroup.add(windowGroupBack);
            
            // Side windows if building is wide enough
            if (depth > 4) {
              // Don't put windows on all sides for industrial buildings
              if (style !== 'industrial' || Math.random() > 0.5) {
                const windowGroupSide = windowGroup.clone();
                windowGroupSide.rotation.y = Math.PI / 2;
                windowGroupSide.position.x = width / 2 + 0.01;
                windowGroupSide.position.z = (x * windowSpacing) - (depth / 2) + windowSize;
                buildingGroup.add(windowGroupSide);
                
                const windowGroupSide2 = windowGroup.clone();
                windowGroupSide2.rotation.y = -Math.PI / 2;
                windowGroupSide2.position.x = -width / 2 - 0.01;
                windowGroupSide2.position.z = (x * windowSpacing) - (depth / 2) + windowSize;
                buildingGroup.add(windowGroupSide2);
              }
            }
          }
        }
      }
    };
    
    // Add architectural details specific to each style
    const addDetails = () => {
      if (style === 'modern' && height > 10) {
        // Add antenna or communication equipment to modern skyscrapers
        const antennaMaterial = new THREE.MeshStandardMaterial({
          color: '#CCCCCC',
          metalness: 0.8,
          roughness: 0.2
        });
        
        const antennaHeight = 1.5 + Math.random() * 1.5;
        const antennaMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, antennaHeight, 8),
          antennaMaterial
        );
        
        antennaMesh.position.y = height / 2 + antennaHeight / 2;
        buildingGroup.add(antennaMesh);
        
        // Add small satellite dishes or equipment
        if (Math.random() > 0.5) {
          const satelliteDish = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 8, 8, 0, Math.PI),
            antennaMaterial
          );
          
          satelliteDish.rotation.x = Math.PI / 4;
          satelliteDish.position.set(
            width / 2 - 0.3,
            height / 2 - 0.2,
            depth / 2 - 0.3
          );
          buildingGroup.add(satelliteDish);
        }
      } else if (style === 'classic') {
        // Add decorative elements to classic buildings
        const detailMaterial = new THREE.MeshStandardMaterial({
          color: '#EAEAEA',
          roughness: 0.7
        });
        
        // Add columns if it's a wide building
        if (width > 4 && height > 6) {
          const columnRadius = 0.15;
          const columnHeight = Math.min(height - 1, 4);
          
          // Place columns at the front
          [-width/2 + columnRadius*2, width/2 - columnRadius*2].forEach(xPos => {
            const column = new THREE.Mesh(
              new THREE.CylinderGeometry(columnRadius, columnRadius, columnHeight, 8),
              detailMaterial
            );
            
            column.position.set(
              xPos,
              -height/2 + columnHeight/2 + 0.5,
              depth/2 + columnRadius
            );
            buildingGroup.add(column);
            
            // Column caps
            const capMesh = new THREE.Mesh(
              new THREE.CylinderGeometry(columnRadius*1.3, columnRadius*1.3, 0.2, 8),
              detailMaterial
            );
            capMesh.position.y = columnHeight/2 + 0.1;
            column.add(capMesh);
            
            // Base caps
            const baseCapMesh = new THREE.Mesh(
              new THREE.CylinderGeometry(columnRadius*1.3, columnRadius*1.3, 0.2, 8),
              detailMaterial
            );
            baseCapMesh.position.y = -columnHeight/2 - 0.1;
            column.add(baseCapMesh);
          });
        }
      } else if (style === 'industrial') {
        // Add industrial details like pipes, ventilation, etc.
        const pipeMaterial = new THREE.MeshStandardMaterial({
          color: '#777777',
          metalness: 0.6,
          roughness: 0.7
        });
        
        // Add pipes on the sides
        if (Math.random() > 0.5) {
          const pipeRadius = 0.1;
          const pipeHeight = height * 0.7;
          
          const pipe = new THREE.Mesh(
            new THREE.CylinderGeometry(pipeRadius, pipeRadius, pipeHeight, 8),
            pipeMaterial
          );
          
          pipe.position.set(
            width/2 + pipeRadius,
            -height/4,
            depth/4
          );
          pipe.rotation.z = Math.PI / 2;
          buildingGroup.add(pipe);
          
          // Add vertical section
          const verticalPipe = new THREE.Mesh(
            new THREE.CylinderGeometry(pipeRadius, pipeRadius, height/2, 8),
            pipeMaterial
          );
          
          verticalPipe.position.set(
            width/2 + pipeRadius,
            0,
            depth/4
          );
          buildingGroup.add(verticalPipe);
        }
        
        // Add ventilation units on the roof
        if (Math.random() > 0.3) {
          const ventMaterial = new THREE.MeshStandardMaterial({
            color: '#555555',
            roughness: 0.9
          });
          
          const ventSize = 0.5 + Math.random() * 0.5;
          const ventMesh = new THREE.Mesh(
            new THREE.BoxGeometry(ventSize, ventSize/2, ventSize),
            ventMaterial
          );
          
          ventMesh.position.set(
            width/4 - Math.random() * width/2,
            height/2 + ventSize/4,
            depth/4 - Math.random() * depth/2
          );
          buildingGroup.add(ventMesh);
        }
      }
    };
    
    // Apply windows and details
    addWindows();
    addDetails();
    
    return buildingGroup;
  };
  
  // Crea alberi stilizzati
  const createTree = (size: number = 1) => {
    const treeGroup = new THREE.Group();
    
    // Trunk
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: '#8B4513',
      roughness: 0.9
    });
    
    const trunkHeight = size * (1 + Math.random() * 0.5);
    const trunkRadius = size * 0.1;
    
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(trunkRadius, trunkRadius * 1.2, trunkHeight, 8),
      trunkMaterial
    );
    
    trunk.position.y = trunkHeight / 2;
    treeGroup.add(trunk);
    
    // Foliage
    const foliageMaterial = new THREE.MeshStandardMaterial({
      color: isDaytime ? '#2D8831' : '#1A5620',
      roughness: 0.8
    });
    
    const foliageSize = size * (0.8 + Math.random() * 0.4);
    
    // Create 2-3 layers of foliage
    const foliageLayers = 2 + Math.floor(Math.random() * 2);
    const layerStep = size * 0.4;
    
    for (let i = 0; i < foliageLayers; i++) {
      const layerSize = foliageSize * (1 - i * 0.2);
      
      const foliage = new THREE.Mesh(
        new THREE.SphereGeometry(layerSize, 8, 6),
        foliageMaterial
      );
      
      foliage.position.y = trunkHeight + i * layerStep;
      // Slightly randomize positions
      foliage.position.x = (Math.random() - 0.5) * 0.1;
      foliage.position.z = (Math.random() - 0.5) * 0.1;
      
      treeGroup.add(foliage);
    }
    
    // Cast shadows
    treeGroup.traverse(object => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    
    return treeGroup;
  };
  
  // Crea un parcheggio con macchine
  const createParking = (width: number, depth: number) => {
    const parkingGroup = new THREE.Group();
    
    // Asfalto del parcheggio
    const parkingSurface = new THREE.Mesh(
      new THREE.PlaneGeometry(width, depth),
      new THREE.MeshStandardMaterial({ color: '#333333', roughness: 0.9 })
    );
    
    parkingSurface.rotation.x = -Math.PI / 2;
    parkingSurface.position.y = 0.01; // Leggermente sopra il terreno
    parkingGroup.add(parkingSurface);
    
    // Aggiunge strisce di parcheggio
    const stripeMaterial = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      roughness: 0.5
    });
    
    const stripeWidth = 0.1;
    const stripeLength = 2;
    const spacingX = 2.5;
    const rows = Math.floor(width / spacingX) - 1;
    const parkingLanes = 2; // Doppia fila di parcheggi
    const laneSpacing = depth / (parkingLanes + 1);
    
    for (let lane = 0; lane < parkingLanes; lane++) {
      const laneZ = (lane + 0.5) * laneSpacing - depth/2;
      
      for (let i = 0; i < rows; i++) {
        const stripeX = (i + 0.5) * spacingX - width/2;
        
        const stripe = new THREE.Mesh(
          new THREE.PlaneGeometry(stripeWidth, stripeLength),
          stripeMaterial
        );
        
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(stripeX, 0.02, laneZ);
        parkingGroup.add(stripe);
        
        // Aggiunge auto in alcune strisce (in base a random)
        if (Math.random() > 0.4) {
          const car = createCar();
          car.position.set(stripeX, 0, laneZ + (lane === 0 ? -0.8 : 0.8));
          car.rotation.y = lane === 0 ? Math.PI : 0;
          parkingGroup.add(car);
        }
      }
    }
    
    return parkingGroup;
  };
  
  // Crea un'auto semplice
  const createCar = () => {
    const carGroup = new THREE.Group();
    
    // Colori casuali per le auto
    const carColors = ['#FF5555', '#55FF55', '#5555FF', '#FFFF55', '#FF55FF', '#55FFFF', '#FFFFFF', '#000000', '#888888'];
    const randomColor = carColors[Math.floor(Math.random() * carColors.length)];
    
    const carMaterial = new THREE.MeshStandardMaterial({
      color: randomColor,
      roughness: 0.5,
      metalness: 0.5
    });
    
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: '#111111',
      roughness: 0.8
    });
    
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: '#AACCFF',
      transparent: true,
      opacity: 0.7,
      roughness: 0.1,
      metalness: 0.3
    });
    
    // Body dell'auto
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.5, 0.9),
      carMaterial
    );
    body.position.y = 0.25;
    carGroup.add(body);
    
    // Abitacolo
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.4, 0.8),
      glassMaterial
    );
    cabin.position.y = 0.7;
    carGroup.add(cabin);
    
    // Ruote
    const wheelPositions = [
      [-0.6, 0.15, 0.45], // anteriore sinistra
      [0.6, 0.15, 0.45],  // anteriore destra
      [-0.6, 0.15, -0.45], // posteriore sinistra
      [0.6, 0.15, -0.45]   // posteriore destra
    ];
    
    wheelPositions.forEach(position => {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.1, 8),
        wheelMaterial
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(...position);
      carGroup.add(wheel);
    });
    
    // Luci dell'auto
    if (!isDaytime) {
      const headlightMaterial = new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        emissive: '#FFFFFF',
        emissiveIntensity: 0.8
      });
      
      const tailLightMaterial = new THREE.MeshStandardMaterial({
        color: '#FF0000',
        emissive: '#FF0000',
        emissiveIntensity: 0.8
      });
      
      // Fari anteriori
      [0.3, -0.3].forEach(offset => {
        const headlight = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 8, 8),
          headlightMaterial
        );
        headlight.position.set(0.9, 0.25, offset);
        carGroup.add(headlight);
        
        // Luce del faro
        const headlightLight = new THREE.PointLight('#FFFFFF', 0.5, 5);
        headlightLight.position.set(1.0, 0.25, offset);
        carGroup.add(headlightLight);
      });
      
      // Luci posteriori
      [0.3, -0.3].forEach(offset => {
        const tailLight = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 8, 8),
          tailLightMaterial
        );
        tailLight.position.set(-0.9, 0.25, offset);
        carGroup.add(tailLight);
      });
    }
    
    carGroup.scale.set(0.4, 0.4, 0.4); // Scala l'auto per adattarla alla scena
    return carGroup;
  };
  
  // Crea un semaforo
  const createTrafficLight = () => {
    const trafficLightGroup = new THREE.Group();
    
    // Palo del semaforo
    const poleMaterial = new THREE.MeshStandardMaterial({
      color: '#444444',
      roughness: 0.7
    });
    
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 3, 8),
      poleMaterial
    );
    pole.position.y = 1.5;
    trafficLightGroup.add(pole);
    
    // Scatola del semaforo
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: '#222222',
      roughness: 0.8
    });
    
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.6, 0.15),
      boxMaterial
    );
    box.position.set(0, 2.7, 0.1);
    trafficLightGroup.add(box);
    
    // Luci del semaforo
    const lightColors = ['#FF0000', '#FFFF00', '#00FF00'];
    const lightState = isDaytime ? 
      [0.2, 0.2, 0.2] : // Di giorno luci meno visibili
      [Math.random() > 0.6 ? 1 : 0.2, Math.random() > 0.2 ? 0.2 : 1, Math.random() > 0.7 ? 1 : 0.2]; // Di notte una luce è sempre accesa
    
    lightColors.forEach((color, i) => {
      const lightMaterial = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: lightState[i]
      });
      
      const light = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 8, 8),
        lightMaterial
      );
      
      light.position.set(0, 2.9 - i * 0.2, 0.1);
      trafficLightGroup.add(light);
    });
    
    return trafficLightGroup;
  };
  
  // Crea una panchina
  const createBench = () => {
    const benchGroup = new THREE.Group();
    
    // Materiali
    const woodMaterial = new THREE.MeshStandardMaterial({
      color: '#8B4513',
      roughness: 0.9
    });
    
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: '#444444',
      roughness: 0.7,
      metalness: 0.5
    });
    
    // Gambe della panchina
    [-0.8, 0.8].forEach(xPos => {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.4, 0.5),
        metalMaterial
      );
      leg.position.set(xPos, 0.2, 0);
      benchGroup.add(leg);
    });
    
    // Seduta
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.05, 0.5),
      woodMaterial
    );
    seat.position.set(0, 0.425, 0);
    benchGroup.add(seat);
    
    // Schienale
    const backRest = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.5, 0.05),
      woodMaterial
    );
    backRest.position.set(0, 0.7, -0.225);
    benchGroup.add(backRest);
    
    return benchGroup;
  };
  
  return (
    <>
      {/* Piano del terreno con texture più dettagliata */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial 
          color={isDaytime ? "#435B61" : "#223438"} 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Edifici principali (nel centro città) - più dettagliati con stili diversi */}
      <group>
        {/* Palazzo centrale - grattacielo principale modernissimo */}
        <primitive 
          object={createWindowPattern(6, 25, 6, "#334455", 'modern')} 
          position={[0, 12.5, -15]}
          castShadow 
          receiveShadow
        />
        
        {/* Edifici del centro con varietà di stili */}
        <primitive 
          object={createWindowPattern(5, 12, 5, "#3A4C5F", 'classic')} 
          position={[-8, 6, -10]}
          castShadow 
          receiveShadow
        />
        
        <primitive 
          object={createWindowPattern(4, 18, 4, "#445566", 'modern')} 
          position={[7, 9, -12]}
          castShadow 
          receiveShadow
        />
        
        <primitive 
          object={createWindowPattern(8, 6, 8, "#556677", 'classic')} 
          position={[0, 3, -5]}
          castShadow 
          receiveShadow
        />
        
        {/* Grattacieli moderni */}
        <primitive 
          object={createWindowPattern(4, 20, 4, "#455570", 'modern')} 
          position={[-16, 10, -18]}
          castShadow 
          receiveShadow
        />
        
        <primitive 
          object={createWindowPattern(5, 22, 5, "#3C4E68", 'modern')} 
          position={[16, 11, -20]}
          castShadow 
          receiveShadow
        />
        
        {/* Edifici di stile classico ed edifici pubblici */}
        <primitive 
          object={createWindowPattern(10, 9, 10, "#7A6855", 'classic')} 
          position={[-15, 4.5, -25]}
          castShadow 
          receiveShadow
        />
        
        <primitive 
          object={createWindowPattern(5, 16, 5, "#3E4C5A", 'modern')} 
          position={[18, 8, -25]}
          castShadow 
          receiveShadow
        />
        
        {/* Edifici industriali */}
        <primitive 
          object={createWindowPattern(9, 7, 10, "#6A5A4A", 'industrial')} 
          position={[20, 3.5, 0]}
          castShadow 
          receiveShadow
        />
        
        <primitive 
          object={createWindowPattern(8, 6, 8, "#4D5D6D", 'industrial')} 
          position={[-20, 3, 0]}
          castShadow 
          receiveShadow
        />
        
        {/* Gruppo di grattacieli principali - skyline distintivo */}
        <group position={[0, 0, -40]}>
          <primitive 
            object={createWindowPattern(5, 30, 5, "#3B4C5F", 'modern')} 
            position={[0, 15, 0]}
            castShadow 
            receiveShadow
          />
          
          <primitive 
            object={createWindowPattern(5, 25, 5, "#4A5F73", 'modern')} 
            position={[-7, 12.5, 2]}
            castShadow 
            receiveShadow
          />
          
          <primitive 
            object={createWindowPattern(5, 22, 5, "#3F5268", 'modern')} 
            position={[7, 11, -2]}
            castShadow 
            receiveShadow
          />
          
          <primitive 
            object={createWindowPattern(6, 18, 6, "#506070", 'modern')} 
            position={[-12, 9, -5]}
            castShadow 
            receiveShadow
          />
          
          <primitive 
            object={createWindowPattern(6, 20, 6, "#425260", 'modern')} 
            position={[12, 10, -5]}
            castShadow 
            receiveShadow
          />
        </group>
        
        {/* Area residenziale con edifici più piccoli e numerosi */}
        {Array.from({ length: 40 }).map((_, i) => {
          // Usa posizioni predeterminate per coerenza
          const gridSize = 6; // Distanza tra gli edifici
          const gridX = Math.floor(i / 8) - 2; // Disposizione a griglia
          const gridZ = (i % 8) - 4;
          
          // Posiziona gli edifici in modo da non sovrapporsi a quelli principali
          const posX = gridX * gridSize * 2 + (Math.random() * 2 - 1);
          const posZ = -30 - gridZ * gridSize + (Math.random() * 2 - 1); // Dietro gli edifici principali
          
          // Varia le altezze per un aspetto più realistico
          const height = 3 + Math.floor(Math.random() * 4);
          const width = 2 + Math.random() * 2;
          const depth = 2 + Math.random() * 2;
          
          // Colori variabili per gli edifici residenziali
          const colorHue = 210 + (Math.random() * 40 - 20);
          const colorSat = 10 + Math.random() * 20;
          const colorLight = 30 + Math.random() * 20;
          
          // Scegli uno stile casuale
          const styles = ['modern', 'classic', 'classic', 'industrial'] as const;
          const style = styles[Math.floor(Math.random() * styles.length)];
          
          return (
            <primitive 
              key={`residential-${i}`}
              object={createWindowPattern(width, height, depth, `hsl(${colorHue}, ${colorSat}%, ${colorLight}%)`, style)}
              position={[posX, height/2, posZ]}
              castShadow 
              receiveShadow
            />
          );
        })}
        
        {/* Strade principali */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -15]} receiveShadow>
          <planeGeometry args={[80, 12]} />
          <meshStandardMaterial 
            color="#111" 
            roughness={0.9}
          />
        </mesh>
        
        <mesh rotation={[-Math.PI / 2, Math.PI / 2, 0]} position={[0, 0.01, -15]} receiveShadow>
          <planeGeometry args={[80, 12]} />
          <meshStandardMaterial 
            color="#111" 
            roughness={0.9}
          />
        </mesh>
        
        {/* Strade secondarie */}
        {[-20, -10, 10, 20, 30].map((offset, i) => (
          <mesh key={`road-h-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[offset, 0.01, -15]} receiveShadow>
            <planeGeometry args={[6, 60]} />
            <meshStandardMaterial 
              color="#1A1A1A" 
              roughness={0.85}
            />
          </mesh>
        ))}
        
        {[-35, -25, -5, 5, 15].map((offset, i) => (
          <mesh key={`road-v-${i}`} rotation={[-Math.PI / 2, Math.PI / 2, 0]} position={[0, 0.01, offset]} receiveShadow>
            <planeGeometry args={[6, 80]} />
            <meshStandardMaterial 
              color="#1A1A1A" 
              roughness={0.85}
            />
          </mesh>
        ))}
        
        {/* Dettagli stradali e marciapiedi */}
        <group position={[0, 0, -15]}>
          {/* Marciapiedi */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
            <planeGeometry args={[80, 14]} />
            <meshStandardMaterial 
              color="#111" 
              roughness={0.9}
            />
          </mesh>
          
          {/* Marciapiedi lungo le strade principali */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} receiveShadow>
            <planeGeometry args={[80, 0.8]} />
            <meshStandardMaterial 
              color="#888888" 
              roughness={0.9}
            />
          </mesh>
          
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 7]} receiveShadow>
            <planeGeometry args={[80, 0.8]} />
            <meshStandardMaterial 
              color="#888888" 
              roughness={0.9}
            />
          </mesh>
          
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, -7]} receiveShadow>
            <planeGeometry args={[80, 0.8]} />
            <meshStandardMaterial 
              color="#888888" 
              roughness={0.9}
            />
          </mesh>
        </group>
        
        {/* Strisce pedonali */}
        {[-20, 0, 20].map((offset, i) => (
          <group key={`crossing-${i}`} position={[offset, 0.07, -15]}>
            {Array.from({ length: 6 }).map((_, j) => (
              <mesh key={`stripe-${i}-${j}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, (j - 2.5) * 1.5]} receiveShadow>
                <planeGeometry args={[0.8, 5]} />
                <meshStandardMaterial 
                  color="#FFFFFF" 
                  roughness={0.8}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      
      {/* Parcheggi in diverse zone */}
      <primitive
        object={createParking(15, 8)}
        position={[25, 0, -5]}
        receiveShadow
      />
      
      <primitive
        object={createParking(12, 6)}
        position={[-25, 0, -35]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      />
      
      {/* Posiziona semafori alle intersezioni principali */}
      {[
        [6, -9], [6, -21], [-6, -9], [-6, -21],
        [16, -9], [16, -21], [-16, -9], [-16, -21]
      ].map((pos, i) => (
        <primitive 
          key={`traffic-${i}`}
          object={createTrafficLight()}
          position={[pos[0], 0, pos[1]]}
          castShadow
          receiveShadow
        />
      ))}
      
      {/* Alberi in varie posizioni */}
      <group position={[0, 0, 0]}>
        {/* Filari di alberi lungo le strade */}
        {Array.from({ length: 12 }).map((_, i) => (
          <primitive
            key={`tree-row1-${i}`}
            object={createTree(1 + Math.random() * 0.5)}
            position={[-30 + i * 5, 0, -8]}
            castShadow
            receiveShadow
          />
        ))}
        
        {Array.from({ length: 12 }).map((_, i) => (
          <primitive
            key={`tree-row2-${i}`}
            object={createTree(1 + Math.random() * 0.5)}
            position={[-30 + i * 5, 0, -22]}
            castShadow
            receiveShadow
          />
        ))}
        
        {/* Gruppi di alberi sparsi */}
        {Array.from({ length: 30 }).map((_, i) => {
          const angle = Math.random() * Math.PI * 2;
          const radius = 30 + Math.random() * 20;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius - 15;
          
          return (
            <primitive
              key={`tree-scattered-${i}`}
              object={createTree(0.8 + Math.random())}
              position={[x, 0, z]}
              castShadow
              receiveShadow
            />
          );
        })}
      </group>
      
      {/* Panchine nei parchi e spazi pubblici */}
      {[
        [10, -5], [-10, -5], [10, -25], [-10, -25],
        [25, -15], [-25, -15], [0, -35]
      ].map((pos, i) => (
        <primitive
          key={`bench-${i}`}
          object={createBench()}
          position={[pos[0], 0, pos[1]]}
          rotation={[0, Math.random() * Math.PI * 2, 0]}
          castShadow
          receiveShadow
        />
      ))}
      
      {/* Cielo e illuminazione */}
      <Sky
        distance={450000}
        sunPosition={isDaytime ? [0, 1, 0] : [0, -1, 0]}
        inclination={isDaytime ? 0.5 : 0.15}
        azimuth={0.25}
        turbidity={isDaytime ? 10 : 20}
        rayleigh={isDaytime ? 0.5 : 0.3}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      
      {/* Luce ambientale */}
      <ambientLight intensity={isDaytime ? 0.5 : 0.1} />
      
      {/* Luce direzionale che rappresenta il sole o la luna */}
      <directionalLight
        position={isDaytime ? [10, 20, 10] : [-10, 10, -10]}
        intensity={isDaytime ? 1.0 : 0.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={80}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      
      {/* Luce soffusa di riempimento */}
      <directionalLight
        position={[-10, 5, 10]}
        intensity={isDaytime ? 0.2 : 0.05}
        castShadow={false}
      />
      
      {/* Aggiungi luci della città di notte */}
      {!isDaytime && (
        <>
          {/* Luci stradali principali */}
          {Array.from({ length: 20 }).map((_, i) => {
            const x = (i % 5) * 10 - 20;
            const z = Math.floor(i / 5) * 10 - 35;
            return (
              <pointLight 
                key={`streetlight-${i}`} 
                position={[x, 3, z]} 
                intensity={0.8} 
                distance={15} 
                color="#FFF5E0" 
                castShadow={false}
              />
            );
          })}
          
          {/* Luci decorative per gli edifici più importanti */}
          <spotLight
            position={[0, 2, -10]}
            angle={0.5}
            intensity={1.5}
            distance={20}
            color="#5F85DB"
            target-position={[0, 15, -15]}
            castShadow={false}
          />
          
          <spotLight
            position={[-10, 2, -20]}
            angle={0.6}
            intensity={1.2}
            distance={25}
            color="#DB5F5F"
            target-position={[-15, 12, -25]}
            castShadow={false}
          />
          
          {/* Luci ambientali sparse */}
          {Array.from({ length: 15 }).map((_, i) => {
            const posX = (Math.random() * 60 - 30);
            const posZ = -5 - (Math.random() * 50);
            return (
              <pointLight 
                key={`ambientlight-${i}`} 
                position={[posX, 1 + Math.random() * 2, posZ]} 
                intensity={0.4} 
                distance={8} 
                color={Math.random() > 0.7 ? "#FFF5E0" : Math.random() > 0.5 ? "#FFE0CC" : "#E0CCFF"} 
                castShadow={false}
              />
            );
          })}
          
          {/* Luci del traffico (macchine in movimento) */}
          {Array.from({ length: 10 }).map((_, i) => {
            const road = Math.random() > 0.5;
            const direction = Math.random() > 0.5 ? 1 : -1;
            const position = [
              road ? (Math.random() * 60 - 30) : (direction * 5),
              0.5,
              road ? (direction * 5) : (Math.random() * 60 - 30)
            ];
            
            return (
              <group key={`carlight-${i}`} position={position}>
                <pointLight
                  intensity={0.8}
                  distance={10}
                  color="#FFFFFF"
                  position={[direction * 0.5, 0, 0]}
                  castShadow={false}
                />
                <pointLight
                  intensity={0.5}
                  distance={3}
                  color="#FF0000"
                  position={[-direction * 0.5, 0, 0]}
                  castShadow={false}
                />
              </group>
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
