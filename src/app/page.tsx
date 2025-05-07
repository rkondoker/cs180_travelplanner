"use client";

import Example from "@/components/example";
import LogIn from "@/components/login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Navbar />
      <Example />
      <LogIn />
    </div>
  );
};

export default Home;
