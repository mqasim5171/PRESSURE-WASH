import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Star, Clock, Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="shadow-md fixed w-full top-0 z-50">
      {/* Top Info Bar */}
      <div className="bg-[#F79029] text-white text-xs sm:text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-center gap-4 sm:gap-6 flex-wrap items-center">
          <div className="flex items-center gap-1 sm:gap-2">
            <Clock size={14} />
            <span>Limited Time: Same-Day Service Available</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Star size={14} />
            <span>5-Star Rated Service</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Phone size={14} />
            <span> Call Now: 0414 203 262</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 sm:px-6">
          {/* Logo + Company Name */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <img
              src="/logo.png"
              alt="Arcturus Logo"
              className="h-10 sm:h-14 w-auto"
            />
            <span className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wide"
              style={{ color: "#314085" }}>
              Arcturus <span className="text-[#F79029]">Services</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link to="/" className="text-gray-700 hover:text-[#F79029] transition-colors font-medium">Home</Link>
            <Link to="/services" className="text-gray-700 hover:text-[#F79029] transition-colors font-medium">Services</Link>
            <Link to="/about" className="text-gray-700 hover:text-[#F79029] transition-colors font-medium">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-[#F79029] transition-colors font-medium">Contact</Link>
            <Link to="/areas" className="text-gray-700 hover:text-[#F79029] transition-colors font-medium">Areas</Link>
            <Link to="/blog" className="text-gray-700 hover:text-[#F79029] transition-colors font-medium">Blog</Link>
            <Link to="/contact" className="bg-[#F79029] text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors shadow-md">
              Get a Quote
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-[#F79029]"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-md">
            <nav className="flex flex-col space-y-2 px-4 pb-4">
              <Link to="/" className="text-gray-700 hover:text-[#F79029] font-medium">Home</Link>
              <Link to="/services" className="text-gray-700 hover:text-[#F79029] font-medium">Services</Link>
              <Link to="/about" className="text-gray-700 hover:text-[#F79029] font-medium">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-[#F79029] font-medium">Contact</Link>
              <Link to="/areas" className="text-gray-700 hover:text-[#F79029] font-medium">Areas</Link>
              <Link to="/blog" className="text-gray-700 hover:text-[#F79029] font-medium">Blog</Link>
              <Link to="/contact" className="bg-[#F79029] text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors shadow-md">
                Get a Quote
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
