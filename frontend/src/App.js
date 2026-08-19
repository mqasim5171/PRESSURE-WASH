// src/App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import PackageDetail from "./pages/PackageDetail";
import AreasPage from "./pages/Areas";
import AreaDetailPage from "./pages/AreaDetailPage";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";

import ThemeProvider from "./lib/ThemeProvider";

// Browsers restore the previous scroll position on a plain reload by
// default (history.scrollRestoration === "auto") - independent of any
// hash in the URL. That's a reasonable default for, say, a long article,
// but on a marketing homepage with a hero carousel it just reads as "I hit
// refresh and it dumped me halfway down the page." Turning restoration off
// makes every reload start at the top, like a fresh visit.
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

// Code-split: the entire admin panel (tables, forms, the rich-text editor
// dependency, etc.) is a meaningful chunk of JS that a public site visitor
// never needs. Lazy-loading it means that code only ever downloads for
// someone who actually navigates to /admin, instead of bloating every
// visitor's first page load.
const AdminRoutes = lazy(() => import("./admin/AdminRoutes"));

// The public marketing site - own Header/Footer chrome. Split out from
// AdminRoutes (which renders its own layout entirely, see
// admin/components/AdminLayout.jsx) so /admin never gets the public nav.
function PublicSite() {
  return (
    <ThemeProvider>
    <div className="App min-h-screen bg-white">
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />

          {/* Services */}
          <Route path="/services" element={<Services />} />
          {/* Legacy slugs from before solar cleaning + thermal scanning were
              combined into one flagship service, and pressure washing was
              renamed to concrete cleaning - keep old links working. */}
          <Route path="/services/drone-based-washing" element={<Navigate to="/services/solar-cleaning-maintenance" replace />} />
          <Route path="/services/pressure-washing" element={<Navigate to="/services/concrete-cleaning" replace />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />

          {/* Packages - both the top "Individual Packages" grid (Package
              model) and the "Combine services" bundles grid (Bundle model)
              resolve here; PackageDetail.jsx tries Package then Bundle. */}
          <Route path="/packages/:slug" element={<PackageDetail />} />

          {/* Areas */}
          <Route path="/areas" element={<AreasPage />} />
          <Route path="/areas/:slug" element={<AreaDetailPage />} />
          {/* Alias so older links /area/:slug still work */}
          <Route path="/area/:slug" element={<AreaDetailPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
    </ThemeProvider>
  );
}

const AdminLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-slate-400 text-sm">Loading admin…</div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminRoutes />
            </Suspense>
          }
        />
        <Route path="/*" element={<PublicSite />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
