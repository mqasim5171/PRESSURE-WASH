import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { biz } from '../../lib/config';
import { copy } from '../../lib/copy';
import { cn } from '../../lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (href) => {
    if (href.startsWith('/#')) {
      const sectionId = href.replace('/#', '');
      scrollToSection(sectionId);
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-slate-900 text-white text-sm py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
              {copy.topbar.map((item, index) => (
                <span key={index} className="whitespace-nowrap">{item}</span>
              ))}
            </div>
            <a 
              href={`tel:${biz.phone.replace(/\s+/g, '')}`}
              className="text-blue-300 hover:text-blue-200 font-medium transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-200",
        isScrolled 
          ? "bg-white/95 backdrop-blur-sm shadow-lg" 
          : "bg-white"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg text-slate-900">{biz.name}</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {copy.nav.map((item) => (
                item.href.startsWith('/#') ? (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </nav>

            {/* Phone & Mobile Menu */}
            <div className="flex items-center gap-4">
              <a 
                href={`tel:${biz.phone.replace(/\s+/g, '')}`}
                className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {biz.phone}
              </a>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 hover:text-blue-600 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t bg-white py-4">
              <nav className="flex flex-col gap-4">
                {copy.nav.map((item) => (
                  item.href.startsWith('/#') ? (
                    <button
                      key={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className="text-left text-slate-700 hover:text-blue-600 font-medium transition-colors py-2"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-slate-700 hover:text-blue-600 font-medium transition-colors py-2"
                    >
                      {item.label}
                    </Link>
                  )
                ))}
                <a 
                  href={`tel:${biz.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 text-blue-600 font-semibold py-2 sm:hidden"
                >
                  <Phone className="w-4 h-4" />
                  {biz.phone}
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;