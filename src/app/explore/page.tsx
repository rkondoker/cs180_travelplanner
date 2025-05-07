"use client";
import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

export default function ExplorePage() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const isGoogleMapsLoaded = useGoogleMaps();

  useEffect(() => {
    if (!isGoogleMapsLoaded || !window.google?.maps) return;

    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    try {
      const newMap = new window.google.maps.Map(mapElement, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      });

      setMap(newMap);
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [isGoogleMapsLoaded]);

  return (
    <main className="min-h-screen">
      <TopBar />
      <div id="map" className="w-full h-[calc(100vh-4rem)] mt-16" />
    </main>
  );
} 