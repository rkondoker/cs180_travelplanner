"use client";
import { useEffect, useState } from "react";

const backgroundImages = [
  "/images/travel1.jpg",
  "/images/travel2.jpg",
  "/images/travel3.jpg",
];

export default function BackgroundImage() {
  const [currentImage, setCurrentImage] = useState(backgroundImages[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let index = 0;
    const body = document.body;
    
    // Add transition styles to body
    body.style.transition = "background-image 1s ease-in-out";
    
    const changeBackground = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        body.style.backgroundImage = `url('${backgroundImages[index]}')`;
        setCurrentImage(backgroundImages[index]);
        setIsTransitioning(false);
        index = (index + 1) % backgroundImages.length;
      }, 1000); // Wait for fade out
    };

    // Set initial background
    body.style.backgroundImage = `url('${backgroundImages[0]}')`;
    body.style.backgroundSize = "cover";
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundPosition = "center";

    const interval = setInterval(changeBackground, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  return null;
} 