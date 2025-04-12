'use client';

import { Environment, OrbitControls } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import { useProduct } from 'components/product/product-context';
import { useEffect, useState } from 'react';
import { DoubleSide } from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

interface Model3DProps {
  url: string;
  color: string;
}

function Model({ url, color }: Model3DProps) {
  const stlGeometry = useLoader(STLLoader, url);
  
  useEffect(() => {
    if (stlGeometry) {
      // Center the geometry
      stlGeometry.center();
      // Compute the bounding box and adjust scale if needed
      stlGeometry.computeBoundingBox();
    }
  }, [stlGeometry]);
  
  return (
    <mesh 
      geometry={stlGeometry} 
      castShadow 
      receiveShadow 
      position={[0, 0, 0]}
      // Drehen des Modells um 90 Grad um die X-Achse, um es richtig herum zu stellen
      rotation={[-Math.PI/2, 0, 0]}
    >
      <meshPhysicalMaterial 
        color={color} 
        roughness={0.3}
        metalness={0.1}
        clearcoat={0.5}
        clearcoatRoughness={0.2}
        side={DoubleSide}
      />
    </mesh>
  );
}

export default function ModelViewer({ modelPath, initialColor = "#f1f1f1" }: { modelPath: string, initialColor?: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [modelColor, setModelColor] = useState(initialColor);
  
  // Verwende useProduct nur, wenn wir innerhalb eines ProductProvider sind
  let productState;
  try {
    const { state } = useProduct();
    productState = state;
  } catch (error) {
    // Falls useProduct einen Fehler wirft, ignorieren wir ihn und verwenden die Standard-Farbe
    productState = null;
  }
  
  // Farbzuordnung: Ordnet Shopify-Variantennamen den entsprechenden Hex-Farbcodes zu
  const colorMap: Record<string, string> = {
    "Weiß": "#f1f1f1",
    "White": "#f1f1f1",
    "Schwarz": "#212121",
    "Black": "#212121",
    "Gold": "#FFD700",
    "Silber": "#C0C0C0",
    "Silver": "#C0C0C0",
    "Kupfer": "#B87333",
    "Copper": "#B87333",
    "Blau": "#1E90FF",
    "Blue": "#1E90FF",
    "Rot": "#DC143C",
    "Red": "#DC143C",
    "Grün": "#2E8B57",
    "Green": "#2E8B57",
    "Gelb": "#FFD700",
    "Yellow": "#FFD700",
  };
  
  // Sucht nach einer Farbvariante in den state-Objekten
  useEffect(() => {
    // Wenn kein Produktstatus vorhanden ist, Standardfarbe beibehalten
    if (!productState) return;
    
    // Überprüfen, ob Farbe in den ausgewählten Optionen vorhanden ist (häufige Option-Namen)
    const colorOptionNames = ['color', 'farbe', 'colour'];
    
    // Suche nach einer passenden Farbvariante in den Optionen
    for (const [key, value] of Object.entries(productState)) {
      if (colorOptionNames.includes(key.toLowerCase()) && colorMap[value]) {
        setModelColor(colorMap[value]);
        break;
      }
    }
  }, [productState]);
  
  useEffect(() => {
    // Set loading to false after a short delay to ensure component is mounted
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div className="h-80 w-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">Loading 3D model...</div>;
  }

  return (
    <div className="relative h-96 w-full">
      {/* Die separate Farbauswahl wurde entfernt, da die Farbe jetzt über die Produktvarianten gesteuert wird */}
      
      <Canvas 
        shadows
        camera={{ position: [750, 0, 0], fov: 30 }}
        gl={{ 
          antialias: true,
          powerPreference: 'default',
          // Lower precision for better performance and reduced memory usage
          precision: 'lowp',
          // Enable context preservation and loss handling
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false
        }}
        // Handle WebGL context loss with retry capability
        onCreated={({ gl }) => {
          // Add context loss handler
          const canvas = gl.domElement;
          canvas.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            console.warn('WebGL context lost. Attempting to restore...');
            // Force a re-render after a brief timeout
            setTimeout(() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 500);
            }, 1000);
          });
        }}
      >
        {/* Enhanced lighting for better shadow details */}
        <color attach="background" args={["#f5f5f5"]} />
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[10, 15, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1} 
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight 
          position={[-5, 5, 5]} 
          intensity={0.5} 
          castShadow 
        />
        <pointLight position={[0, -10, 0]} intensity={0.5} />
        
        {/* Environment adds realistic reflections */}
        <Environment preset="sunset" />
        
        {/* Model with updated color */}
        <Model url={modelPath} color={modelColor} />
        
        <OrbitControls 
          // Disable all user interactions
          enableZoom={false}
          enableRotate={false}
          enablePan={false}
          // Keep automatic rotation for presentation
          autoRotate={true}
          autoRotateSpeed={1.0}
          // Fixed view settings
          target={[0, 0, 0]}
          // Lock position
          makeDefault
        />
      </Canvas>
    </div>
  );
}
