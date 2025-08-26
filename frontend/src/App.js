import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";


// Layout components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";

import AreasPage from "./pages/Areas";


import ServiceDetail from "./pages/ServiceDetail";
import Blog from "./pages/Blog";

function App() {
  return (
    <div className="App min-h-screen bg-white">
      <BrowserRouter>
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
             <Route path="/blog" element={<Blog />} />

            {/* New route for listing services */}
            <Route path="/services" element={<Services />} />

           {/* Dynamic route for each service detail */}
            <Route path="/services/:slug" element={<ServiceDetail />} />

            <Route path="/areas" element={<AreasPage />} />
            <Route path="/blog" element={<Blog />} />

          </Routes>
        </div>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
