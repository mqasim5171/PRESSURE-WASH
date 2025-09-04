import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Star, Clock, Menu, X, ChevronDown, MapPin } from "lucide-react";
import { copy } from "@/lib/copy"; // ✅ simplified path (adjust if needed)

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAreasOpen, setIsAreasOpen] = useState(false);
  let timeoutId;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsAreasOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsAreasOpen(false);
    }, 150); // small delay so it doesn’t instantly disappear
  };

  return (
    <header className="shadow-md fixed w-full top-0 z-50 bg-white">
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
            <span> Call Now: 0280 001 080</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <img
              src="/logo.png"
              alt="Arcturus Logo"
              className="h-10 sm:h-14 w-auto"
            />
            <span
              className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wide"
              style={{ color: "#314085" }}
            >
              Arcturus <span className="text-[#F79029]">Services</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link to="/" className="text-gray-700 hover:text-[#F79029] font-medium transition-colors">Home</Link>
            <Link to="/services" className="text-gray-700 hover:text-[#F79029] font-medium transition-colors">Services</Link>
            <Link to="/about" className="text-gray-700 hover:text-[#F79029] font-medium transition-colors">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-[#F79029] font-medium transition-colors">Contact</Link>

            {/* Areas Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Parent clickable link to /areas */}
              <Link
                to="/areas"
                className="flex items-center text-gray-700 hover:text-[#F79029] font-medium"
              >
                Areas <ChevronDown size={16} className="ml-1 transition-transform duration-200" />
              </Link>

              {isAreasOpen && (
                <div className="absolute top-full left-0 w-[380px] bg-white shadow-2xl rounded-xl p-5 z-50">
                  {/* Dropdown Header */}
                  <div className="mb-3">
                    <h4 className="text-base font-semibold text-gray-800">Service Areas</h4>
                    <p className="text-sm text-gray-500">
                      Professional cleaning services across all Sydney suburbs
                    </p>
                  </div>

                  {/* Two-column grid of areas */}
                  <div className="grid grid-cols-2 gap-2">
                    {copy.areas.featured.map((area) => (
                      <Link
                        key={area.slug}
                        to={`/areas/${area.slug}`}
                        className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100 hover:text-[#F79029] transition"
                      >
                        <MapPin size={14} className="text-[#F79029]" />
                        {area.name}
                      </Link>
                    ))}
                  </div>

                  {/* Footer link */}
                  <div className="mt-4 pt-2 border-t border-gray-200">
                    <Link
                      to="/areas"
                      className="block text-sm font-medium text-[#314085] hover:text-[#F79029]"
                    >
                      View All Service Areas →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/blog" className="text-gray-700 hover:text-[#F79029] font-medium transition-colors">Blog</Link>
            <Link
              to="/contact"
              className="bg-[#F79029] text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors shadow-md"
            >
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

              {/* Mobile Areas Dropdown */}
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer text-gray-700 hover:text-[#F79029] font-medium">
                  Areas
                </summary>
                <div className="pl-4 mt-2 flex flex-col space-y-1">
                  {copy.areas.featured.map((area) => (
                    <Link
                      key={area.slug}
                      to={`/areas/${area.slug}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#F79029]"
                      onClick={() => setIsOpen(false)}
                    >
                      <MapPin size={14} className="text-[#F79029]" />
                      {area.name}
                    </Link>
                  ))}
                  <Link
                    to="/areas"
                    className="mt-2 text-sm font-medium text-[#314085] hover:text-[#F79029]"
                    onClick={() => setIsOpen(false)}
                  >
                    View All Service Areas →
                  </Link>
                </div>
              </details>

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
