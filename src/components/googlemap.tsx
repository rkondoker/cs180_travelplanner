"use client";

import React, { useEffect, useRef } from "react";

const GOOGLE_MAPS_API_KEY = "AIzaSyAX7wp7T42Cu3wqCX-yzp-nI5Y3oyAnv1A";
const HAWAII_COORDS = { lat: 19.5429, lng: -155.6659 };

const GoogleMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existingScript = document.getElementById("googleMapsScript");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "googleMapsScript";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = () => {
        if (window.google && mapRef.current) {
          new window.google.maps.Map(mapRef.current, {
            center: HAWAII_COORDS,
            zoom: 12,
          });
        }
      };
      document.body.appendChild(script);
    } else {
      if (window.google && mapRef.current) {
        new window.google.maps.Map(mapRef.current, {
           center: HAWAII_COORDS,
           zoom: 12,
        });
      }
    }
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "300px", borderRadius: "0 0 16px 16px" }}
    />
  );
};

export default GoogleMap; 