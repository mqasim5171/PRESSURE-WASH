import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { biz } from '../../lib/config';
import { copy } from '../../lib/copy';
import { cn } from '../../lib/utils';
import QuoteModal from '../QuoteModal';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

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

  // Updated navigation order to match reference
  const navigation = [
    { href: "/#services", label: "Services" },
    { href: "/areas", label: "Areas" },
    { href: "/blog", label: "Blog" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Topbar - Marquee style */}
      <div className="bg-slate-900 text-white text-sm py-2 relative overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          <div className="flex items-center gap-8 px-4">
            <span>Limited Time: Same-Day Service Available</span>
            <span>5-Star Rated Service</span>
            <span>📞 Call Now: 0414 203 262</span>
            {/* Duplicate for seamless loop */}
            <span>Limited Time: Same-Day Service Available</span>
            <span>5-Star Rated Service</span>
            <span>📞 Call Now: 0414 203 262</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={cn(
        "sticky top-0 z-40 transition-all duration-200",
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
              {navigation.map((item) => (
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
              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="hidden md:inline-flex bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
              >
                Get Free Quote
              </button>
              
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
        </div>

        {/* Mobile Slide-over Menu */}
        <div className={cn(
          "lg:hidden fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex items-center justify-between p-6 border-b">
            <span className="font-bold text-lg">{biz.name}</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-slate-700 hover:text-blue-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="p-6 space-y-6">
            {navigation.map((item) => (
              item.href.startsWith('/#') ? (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left text-slate-700 hover:text-blue-600 font-medium transition-colors py-2 text-lg"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-slate-700 hover:text-blue-600 font-medium transition-colors py-2 text-lg"
                >
                  {item.label}
                </Link>
              )
            ))}
            
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsQuoteModalOpen(true);
                }}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Free Quote
              </button>
              
              <a 
                href={`tel:${biz.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 text-blue-600 font-semibold py-2"
              >
                <Phone className="w-4 h-4" />
                {biz.phone}
              </a>
            </div>
          </nav>
        </div>

        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </header>

      {/* Quote Modal */}
      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
      />

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </>
  );
};

export default Header;