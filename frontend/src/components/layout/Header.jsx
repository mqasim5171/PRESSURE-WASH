import React from "react";
import { Link } from "react-router-dom";
import { Phone, Star, Clock } from "lucide-react"; // using lucide-react icons

const Header = () => {
  return (
    <header className="shadow-md fixed w-full top-0 z-50">
      {/* Top Info Bar */}
      <div className="bg-[#F79029] text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-center gap-6 flex-wrap items-center">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>Limited Time: Same-Day Service Available</span>
          </div>
          <div className="flex items-center gap-2">
            <Star size={16} />
            <span>5-Star Rated Service</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} />
            <span> Call Now: 0414 203 262</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          {/* Logo + Company Name */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Arcturus Logo"
              className="h-14 w-auto"
            />
            <span className="text-2xl md:text-3xl font-extrabold tracking-wide"
              style={{ color: "#314085" }}>
              Arcturus <span className="text-[#F79029]">Services</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-[#F79029] transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-[#F79029] transition-colors font-medium"
            >
              Services
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-[#F79029] transition-colors font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-[#F79029] transition-colors font-medium"
            >
              Contact
            </Link>

            {/* Get a Quote Button */}
            <Link
              to="/contact"
              className="bg-[#F79029] text-white px-5 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors shadow-md"
            >
              Get a Quote
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
