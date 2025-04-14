'use client';

import ModelViewer from 'components/product/model-viewer';
import { useEffect, useRef, useState } from 'react';

export default function FeaturedModel() {
  // Hier wird der Pfad zum 3D-Modell angegeben, das auf der Startseite angezeigt werden soll
  const defaultModelPath = '/models/creme/together.stl';
  
  // Array von Farben, die wir durchlaufen wollen
  const colors = [
    "#f1f1f1", // Weiß
    "#1E90FF", // Blau
    "#DC143C", // Rot
    "#2E8B57", // Grün
    "#FFD700", // Gold/Gelb
    "#B87333", // Kupfer
    "#C0C0C0", // Silber
    "#212121", // Schwarz
  ];
  
  // State für aktuelle Farbe und Zielfarbe
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const [targetColor, setTargetColor] = useState(colors[0]);
  const [colorIndex, setColorIndex] = useState(0);
  const animationRef = useRef<number | null>(null);
  
  // Funktion zur Interpolation zwischen Farben
  const interpolateColor = (color1: string | undefined, color2: string | undefined, factor: number) => {
    // Umwandlung von Hex zu RGB
    const hex2rgb = (hex: string | undefined) => {
      if (!hex) return [0, 0, 0]; // Default to black if hex is undefined
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
    
    // Umwandlung von RGB zu Hex
    const rgb2hex = (r: number, g: number, b: number) => {
      return "#" + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      }).join("");
    };
    
    const rgb1 = hex2rgb(color1);
    const rgb2 = hex2rgb(color2);
    
    // Lineare Interpolation zwischen den Farben
    const r = rgb1[0] ?? 0 + factor * ((rgb2[0] ?? 0) - (rgb1[0] ?? 0));
    const g = rgb1[1] ?? 0 + factor * ((rgb2[1] ?? 0) - (rgb1[1] ?? 0));
    const b = rgb1[2] ?? 0 + factor * ((rgb2[2] ?? 0) - (rgb1[2] ?? 0));
    
    return rgb2hex(r, g, b);
  };
  
  // Farbwechsel Effekt
  useEffect(() => {
    // Jede 3 Sekunden zur nächsten Farbe wechseln
    const colorChangeInterval = setInterval(() => {
      const nextIndex = (colorIndex + 1) % colors.length;
      setColorIndex(nextIndex);
      setTargetColor(colors[nextIndex]);
    }, 3000);
    
    return () => clearInterval(colorChangeInterval);
  }, [colorIndex, colors]);
  
  // Farbübergang Effekt
  useEffect(() => {
    if (currentColor === targetColor) return;
    
    let start: number | null = null;
    const duration = 1000; // 1 Sekunde für den Farbübergang
    
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      
      const interpolated = interpolateColor(currentColor, targetColor, progress);
      setCurrentColor(interpolated);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetColor, currentColor]);

  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
      <div className="flex flex-col items-center">
        <h2 className="mb-6 text-2xl font-bold">Entdecken Sie unsere 3D Leuchten</h2>
        <div className="w-full max-w-2xl">
          <ModelViewer modelPath={defaultModelPath} initialColor={currentColor} />
        </div>
        <div className="mt-4 text-center">
          <p className="mb-4 text-neutral-700 dark:text-neutral-300">
            Erleben Sie die einzigartige Eleganz unserer LayerLight Kollektion
          </p>
          <a
            href="/product/layerlight-tischlampe"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Jetzt entdecken
          </a>
        </div>
      </div>
    </section>
  );
}
