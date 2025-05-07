"use client";

import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-trip-brown-200 p-6 -xl w-full shadow-lg font-trip-main"> 
            <div className="flex justify-between items-center">
               
           <div> 
            <a href = "/" className= "text-amber--200 text-2xl hover:text-gray-300">TripWise</a>
           </div>
           <div className="flex space-x-6"> 
            <a href = "/about" className= "text-amber-100 text-lg hover:text-gray-300">Trip Planner</a>
            <a href = "/contact" className= "text-amber-100 text-lg hover:text-gray-300">My Trips</a>
           </div>
        
            {/*<h1>Sample Navigation Bar to Upload to Homepage once devloped
            </h1>*/}
        </div>
        </nav>        
    )

}

export default Navbar;