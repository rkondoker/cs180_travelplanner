"use client";
import { useEffect } from "react";

const backgroundImages = [
  "/images/travel1.jpg",
  "/images/travel2.jpg",
  "/images/travel3.jpg",
];

export default function BackgroundImage() {
  useEffect(() => {
    let index = 0;
    const body = document.body;
    const changeBackground = () => {
      body.style.backgroundImage = `url('${backgroundImages[index]}')`;
      body.style.backgroundSize = "cover";
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundPosition = "center";
      index = (index + 1) % backgroundImages.length;
    };
    changeBackground();
    const interval = setInterval(changeBackground, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  return null;
} 