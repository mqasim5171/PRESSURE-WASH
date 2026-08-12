import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, MapPin } from "lucide-react";
import { copy } from "@/lib/copy";

// The whole site runs dark/cyan now (Home and every other page), so the nav
// no longer needs a separate light-theme palette - only Home still gets the
// transparent-over-hero floating treatment, since it's the only page that
// opens on a full-bleed image instead of flat dark content.
const CYAN = "#22d3ee";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAreasOpen, setIsAreasOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  let timeoutId;

  // Home's hero runs for several viewport-heights, so a fixed scrollY
  // threshold either flips the nav to "solid" almost immediately (killing
  // the transparent-over-photo look for ~99% of the hero) or leaves it
  // transparent long after the hero photo has ended (illegible over dark
  // page content). Watching the actual end of the hero via IntersectionObserver
  // gets this right regardless of hero length.
  useEffect(() => {
    if (!isHome) {
      setPastHero(false);
      return;
    }
    const marker = document.getElementById("hero-end");
    if (!marker) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(entry.isIntersecting || entry.boundingClientRect.top < 0),
      { rootMargin: "-64px 0px 0px 0px" }
    );
    observer.observe(marker);
    return () => observer.disconnect();
  }, [isHome]);

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsAreasOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setIsAreasOpen(false);
    }, 150);
  };

  const linkCls = "font-medium text-sm tracking-wide text-white/70 hover:text-white transition-colors";

  const navContent = (
    <div className="max-w-7xl mx-auto flex items-center justify-between py-2.5 px-4 sm:px-6">
      {/* Logo - dot + wordmark carries most of the weight, image mark kept
          small so it reads as a mark next to the name rather than competing
          with it for attention. */}
      <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CYAN }} />
        <img src="/logo.png" alt="" className="h-7 sm:h-8 w-auto" />
        <span className="text-base sm:text-lg font-bold tracking-wider text-white">
          Arcturus <span style={{ color: CYAN }}>Services</span>
        </span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-7">
        <Link to="/" className={linkCls}>Home</Link>
        <Link to="/services" className={linkCls}>Services</Link>
        <Link to="/about" className={linkCls}>About</Link>
        <Link to="/contact" className={linkCls}>Contact</Link>

        {/* Areas Dropdown (Desktop hover) */}
        <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Link to="/areas" className={`flex items-center ${linkCls}`}>
            Areas <ChevronDown size={14} className="ml-1 transition-transform duration-200" />
          </Link>

          {isAreasOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[380px] rounded-2xl p-5 z-50 bg-[#0a0f1a]/95 backdrop-blur-xl border border-white/10 text-white">
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-white">Service Areas</h4>
                <p className="text-xs text-white/50">Professional cleaning services across all Sydney suburbs</p>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {copy.areas.featured.map((area) => (
                  <Link
                    key={area.slug}
                    to={`/areas/${area.slug}`}
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg transition text-white/70 hover:bg-white/10"
                  >
                    <MapPin size={13} style={{ color: CYAN }} />
                    {area.name}
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-white/10">
                <Link to="/areas" className="block text-sm font-medium hover:text-white" style={{ color: CYAN }}>
                  View All Service Areas →
                </Link>
              </div>
            </div>
          )}
        </div>

        <Link to="/blog" className={linkCls}>Blog</Link>
        <Link
          to="/contact"
          className="text-black px-4 py-2 rounded-full font-semibold text-sm hover:bg-white transition-colors"
          style={{ background: CYAN }}
        >
          Get a Quote
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </div>
  );

  const mobileMenu = isOpen && (
    <div className="md:hidden bg-[#02060c]/98 backdrop-blur-xl border-t border-white/10">
      <nav className="flex flex-col space-y-3 px-6 py-6">
        <Link to="/" className={linkCls} onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/services" className={linkCls} onClick={() => setIsOpen(false)}>Services</Link>
        <Link to="/about" className={linkCls} onClick={() => setIsOpen(false)}>About</Link>
        <Link to="/contact" className={linkCls} onClick={() => setIsOpen(false)}>Contact</Link>

        <div className="flex flex-col">
          <button
            onClick={() => setIsAreasOpen(!isAreasOpen)}
            className={`flex justify-between items-center w-full ${linkCls}`}
          >
            Areas
            <ChevronDown size={16} className={`ml-2 transition-transform ${isAreasOpen ? "rotate-180" : ""}`} />
          </button>
          {isAreasOpen && (
            <div className="pl-4 mt-2 flex flex-col space-y-2">
              {copy.areas.featured.map((area) => (
                <Link
                  key={area.slug}
                  to={`/areas/${area.slug}`}
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-[#22d3ee]"
                  onClick={() => setIsOpen(false)}
                >
                  <MapPin size={13} className="text-[#22d3ee]" />
                  {area.name}
                </Link>
              ))}
              <Link
                to="/areas"
                className="mt-1 text-sm font-medium text-[#22d3ee]"
                onClick={() => setIsOpen(false)}
              >
                View All Service Areas →
              </Link>
            </div>
          )}
        </div>

        <Link to="/blog" className={linkCls} onClick={() => setIsOpen(false)}>Blog</Link>
        <Link
          to="/contact"
          className="text-center text-black px-4 py-2.5 rounded-full font-semibold"
          style={{ background: CYAN }}
          onClick={() => setIsOpen(false)}
        >
          Get a Quote
        </Link>
      </nav>
    </div>
  );

  if (isHome) {
    // Floating capsule nav, inset from the viewport edges, sitting on top
    // of the hero rather than a flush full-width bar.
    return (
      <header className="fixed w-full top-4 z-50 px-4">
        <div
          // Transparent (no border, no blur - a stroke reads as a hard
          // outline over a photo, and backdrop-blur creates its own visible
          // edge where blurred pixels meet the sharp image outside it) for
          // as long as the hero photo is actually behind it. Once scrolled
          // past the hero into flat dark page content, switches to the same
          // solid glass pill every other page uses, so it stays legible
          // instead of staying invisible-transparent over nothing.
          className={`max-w-7xl mx-auto rounded-2xl transition-colors duration-300 ${
            pastHero
              ? "bg-[#02060c]/90 backdrop-blur-xl border border-white/10"
              : "bg-black/10"
          }`}
        >
          {navContent}
        </div>

        {isOpen && (
          <div className="max-w-7xl mx-auto mt-2 rounded-2xl bg-[#02060c]/98 backdrop-blur-xl border border-white/10 md:hidden overflow-hidden">
            {mobileMenu}
          </div>
        )}
      </header>
    );
  }

  // Every other page: same dark palette, but a flush solid bar since there's
  // no hero image underneath for a transparent nav to blend into. No
  // backdrop-blur here - at 95% opacity there's nothing visible behind it
  // left to blur, so the filter would just be wasted GPU work on every
  // scroll frame for zero visual difference.
  return (
    <header className="fixed w-full top-0 z-50 bg-[#02060c]/95 border-b border-white/10">
      {navContent}
      {mobileMenu}
    </header>
  );
};

export default Header;
