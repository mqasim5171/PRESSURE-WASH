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
import Areas from "./pages/Areas";
import GalleryPage from "./pages/GalleryPage";
import ServiceDetail from "./pages/ServiceDetail";
import Blog from "./pages/Blog";

function App() {
  return (
    <div className="App min-h-screen bg-white">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/areas" element={<Areas />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
