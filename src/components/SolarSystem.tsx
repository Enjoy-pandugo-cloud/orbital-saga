import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ALL_CELESTIAL_BODIES, AU, DISTANCE_SCALE, SIZE_SCALE, SUN_DATA } from '@/lib/constants';
import InfoPanel from './InfoPanel';
import Controls from './Controls';

const SolarSystem = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const celestialBodiesRef = useRef<Map<string, THREE.Object3D>>(new Map());
  
  const [selectedBody, setSelectedBody] = useState(ALL_CELESTIAL_BODIES[0]);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [timeSpeed, setTimeSpeed] = useState(1); // 1 = normal speed
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Add subtle background
    scene.background = new THREE.Color(0x050A20);
    
    // Create starfield background
    createStarfield(scene);
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000000
    );
    camera.position.set(0, 20, 50);
    cameraRef.current = camera;
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      logarithmicDepthBuffer: true // Helps with depth precision
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 5;
    controls.maxDistance = 500;
    controlsRef.current = controls;
    
    // Create celestial bodies
    createCelestialBodies(scene);
    
    // Add orbit paths
    if (showOrbits) {
      createOrbitPaths(scene);
    }
    
    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Update planet positions
      updateCelestialPositions(timeSpeed);
      
      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Render
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);
  
  // Update orbit paths when showOrbits changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Remove existing orbit paths
    const orbitPaths = sceneRef.current.children.filter(
      child => child.name.startsWith('orbitPath_')
    );
    
    orbitPaths.forEach(path => {
      sceneRef.current?.remove(path);
    });
    
    // Add orbit paths if enabled
    if (showOrbits) {
      createOrbitPaths(sceneRef.current);
    }
  }, [showOrbits]);
  
  // Update labels when showLabels changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    const labels = sceneRef.current.children.filter(
      child => child.name.startsWith('label_')
    );
    
    labels.forEach(label => {
      (label as THREE.Object3D).visible = showLabels;
    });
  }, [showLabels]);
  
  // Focus on selected body
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    const body = celestialBodiesRef.current.get(selectedBody.id);
    
    if (body) {
      const targetPosition = new THREE.Vector3();
      body.getWorldPosition(targetPosition);
      
      // Set target position for orbit controls
      controlsRef.current.target.copy(targetPosition);
      
      // Position camera to show the body
      const distance = selectedBody.id === 'sun' 
        ? selectedBody.radius * SIZE_SCALE * 15
        : selectedBody.radius * SIZE_SCALE * 20;
      
      const cameraOffset = new THREE.Vector3(distance, distance/2, distance);
      cameraRef.current.position.copy(targetPosition).add(cameraOffset);
    }
  }, [selectedBody]);
  
  const createStarfield = (scene: THREE.Scene) => {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount * 3; i += 3) {
      // Random positions in a sphere
      const radius = 10000;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
      
      // Random star sizes
      sizes[i / 3] = Math.random() * 2 + 0.5;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Star material with custom shader
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    stars.name = 'starfield';
    scene.add(stars);
  };
  
  const createCelestialBodies = (scene: THREE.Scene) => {
    // Load texture loader
    const textureLoader = new THREE.TextureLoader();
    
    // Create sun with emissive material
    const sunGeometry = new THREE.SphereGeometry(
      SUN_DATA.radius * SIZE_SCALE, 
      64, 
      64
    );
    const sunMaterial = new THREE.MeshStandardMaterial({
      map: textureLoader.load('/textures/sun.jpg'),
      emissive: new THREE.Color(0xffaa00),
      emissiveMap: textureLoader.load('/textures/sun.jpg'),
      emissiveIntensity: 0.5,
    });
    
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.name = 'sun';
    scene.add(sun);
    celestialBodiesRef.current.set('sun', sun);
    
    // Add sun light
    const sunLight = new THREE.PointLight(0xffffff, 2, 0, 1);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    
    // Create planets
    ALL_CELESTIAL_BODIES.slice(1).forEach(planet => {
      // Planet group to handle rotation and position
      const planetGroup = new THREE.Group();
      planetGroup.name = planet.id;
      scene.add(planetGroup);
      celestialBodiesRef.current.set(planet.id, planetGroup);
      
      // Create planet mesh
      const planetGeometry = new THREE.SphereGeometry(
        planet.radius * SIZE_SCALE,
        32,
        32
      );
      
      const planetMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load(`/textures/${planet.id}.jpg`),
        roughness: 1,
        metalness: 0
      });
      
      const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
      planetMesh.rotation.x = planet.axialTilt * Math.PI / 180;
      planetMesh.castShadow = true;
      planetMesh.receiveShadow = true;
      planetGroup.add(planetMesh);
      
      // Add planet ring if it has one
      if (planet.hasRings && planet.ringTexture && planet.ringInnerRadius && planet.ringOuterRadius) {
        // Enhanced ring creation with increased size and opacity
        const ringGeometry = new THREE.RingGeometry(
          planet.ringInnerRadius * SIZE_SCALE,
          planet.ringOuterRadius * SIZE_SCALE,
          128 // Increase segments for smoother rings
        );
        
        const ringTexture = textureLoader.load(planet.ringTexture);
        ringTexture.anisotropy = 16; // Improve texture quality
        
        // Apply better ring material with higher opacity
        const ringMaterial = new THREE.MeshBasicMaterial({
          map: ringTexture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9, // Increased opacity for better visibility
          depthWrite: false, // Helps with transparent rendering
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.rotation.y = planet.axialTilt * Math.PI / 180;
        
        // Add subtle glow effect
        const ringGlowGeometry = new THREE.RingGeometry(
          planet.ringInnerRadius * SIZE_SCALE * 0.98,
          planet.ringOuterRadius * SIZE_SCALE * 1.02,
          64
        );
        
        const ringGlowMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.15,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        
        const ringGlow = new THREE.Mesh(ringGlowGeometry, ringGlowMaterial);
        ringGlow.rotation.x = Math.PI / 2;
        ringGlow.rotation.y = planet.axialTilt * Math.PI / 180;
        
        // Add both ring and glow to planet group
        planetGroup.add(ring);
        planetGroup.add(ringGlow);
      }
      
      // Add atmosphere if the planet has one
      if (planet.hasAtmosphere && planet.atmosphereColor) {
        const atmRadius = planet.radius * SIZE_SCALE * 1.05;
        const atmosphereGeometry = new THREE.SphereGeometry(atmRadius, 32, 32);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(planet.atmosphereColor),
          transparent: true,
          opacity: 0.2,
          side: THREE.BackSide
        });
        
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        planetGroup.add(atmosphere);
      }
      
      // Add planet label if showLabels is true
      if (showLabels) {
        // Create canvas for label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = 256;
          canvas.height = 128;
          
          context.fillStyle = 'rgba(0, 10, 30, 0.95)';
          context.fillRect(0, 0, canvas.width, canvas.height);
          
          context.strokeStyle = '#4b9cd3';
          context.lineWidth = 2;
          context.strokeRect(0, 0, canvas.width, canvas.height);
          
          context.font = 'bold 42px Arial';
          context.textAlign = 'center';
          context.fillStyle = 'white';
          context.fillText(planet.name, canvas.width/2, 70);
          
          const labelTexture = new THREE.CanvasTexture(canvas);
          const labelMaterial = new THREE.SpriteMaterial({
            map: labelTexture,
            transparent: true
          });
          
          const labelSprite = new THREE.Sprite(labelMaterial);
          labelSprite.position.set(0, planet.radius * SIZE_SCALE * 2, 0);
          labelSprite.scale.set(6, 3, 1);
          labelSprite.name = `label_${planet.id}`;
          
          planetGroup.add(labelSprite);
        }
      }
      
      // Add moons if the planet has any
      if (planet.moons) {
        planet.moons.forEach(moon => {
          const moonGroup = new THREE.Group();
          moonGroup.name = moon.id;
          planetGroup.add(moonGroup);
          
          const moonGeometry = new THREE.SphereGeometry(
            moon.radius * SIZE_SCALE * 5, // Scale up for visibility
            16,
            16
          );
          
          const moonMaterial = new THREE.MeshStandardMaterial({
            map: textureLoader.load(`/textures/${moon.id}.jpg`),
            roughness: 1,
            metalness: 0
          });
          
          const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
          moonMesh.castShadow = true;
          moonMesh.receiveShadow = true;
          moonGroup.add(moonMesh);
        });
      }
    });
  };
  
  const createOrbitPaths = (scene: THREE.Scene) => {
    ALL_CELESTIAL_BODIES.slice(1).forEach(planet => {
      // Elliptical orbit path
      const segments = 128;
      const distance = planet.distanceFromSun * AU * DISTANCE_SCALE;
      
      const orbitPoints = [];
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        orbitPoints.push(new THREE.Vector3(x, 0, z));
      }
      
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x4d7faa,
        transparent: true,
        opacity: 0.5,
        linewidth: 1,
      });
      
      const orbitPath = new THREE.Line(orbitGeometry, orbitMaterial);
      orbitPath.name = `orbitPath_${planet.id}`;
      scene.add(orbitPath);
    });
  };
  
  const updateCelestialPositions = (speed: number) => {
    const time = Date.now() * 0.0001 * speed;
    
    ALL_CELESTIAL_BODIES.slice(1).forEach(planet => {
      const planetObj = celestialBodiesRef.current.get(planet.id);
      if (!planetObj) return;
      
      // Calculate orbital position
      const distance = planet.distanceFromSun * AU * DISTANCE_SCALE;
      const orbitalSpeed = 2 * Math.PI / planet.orbitalPeriod;
      
      const x = Math.cos(time * orbitalSpeed) * distance;
      const z = Math.sin(time * orbitalSpeed) * distance;
      
      // Update position
      planetObj.position.set(x, 0, z);
      
      // Update planet rotation
      const planetMesh = planetObj.children[0] as THREE.Mesh;
      if (planetMesh) {
        // Rotation speed based on planet's rotation period
        const rotationSpeed = planet.rotationPeriod !== 0 
          ? 2 * Math.PI / (planet.rotationPeriod * 24) 
          : 0;
        
        planetMesh.rotation.y += rotationSpeed * 0.01 * speed;
      }
      
      // Update moons if the planet has any
      if (planet.moons) {
        planet.moons.forEach((moon, index) => {
          if (planetObj.children.length > index + 1) {
            const moonGroup = planetObj.children[index + 1] as THREE.Group;
            
            // Calculate moon orbital position
            const moonDistance = moon.distanceFromPlanet * DISTANCE_SCALE * 0.0001;
            const moonOrbitalSpeed = 2 * Math.PI / moon.orbitalPeriod;
            
            const moonX = Math.cos(time * moonOrbitalSpeed * 10) * moonDistance;
            const moonZ = Math.sin(time * moonOrbitalSpeed * 10) * moonDistance;
            
            // Update moon position
            moonGroup.position.set(moonX, 0, moonZ);
          }
        });
      }
    });
    
    // Rotate sun
    const sun = celestialBodiesRef.current.get('sun');
    if (sun && sun instanceof THREE.Mesh) {
      sun.rotation.y += 0.001 * speed;
    }
  };
  
  const handleBodySelect = (id: string) => {
    const body = ALL_CELESTIAL_BODIES.find(body => body.id === id);
    if (body) {
      setSelectedBody(body);
    }
  };
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      
      <InfoPanel 
        body={selectedBody} 
        position="top-right"
      />
      
      <Controls
        bodies={ALL_CELESTIAL_BODIES}
        selectedBody={selectedBody}
        onBodySelect={handleBodySelect}
        showOrbits={showOrbits}
        setShowOrbits={setShowOrbits}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        timeSpeed={timeSpeed}
        setTimeSpeed={setTimeSpeed}
      />
    </div>
  );
};

export default SolarSystem;
