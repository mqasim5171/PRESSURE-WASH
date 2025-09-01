// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import AreasPage from "./pages/Areas";
import AreaDetailPage from "./pages/AreaDetailPage";
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

            {/* Services */}
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />

            {/* Areas */}
            <Route path="/areas" element={<AreasPage />} />
            <Route path="/areas/:slug" element={<AreaDetailPage />} />
            {/* Alias so older links /area/:slug still work */}
            <Route path="/area/:slug" element={<AreaDetailPage />} />
          </Routes>
        </div>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;