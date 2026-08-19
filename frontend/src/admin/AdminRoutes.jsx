import React from "react";
import { Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLogin from "./pages/Login";
import AdminDashboard from "./pages/Dashboard";
import AdminHomepage from "./pages/Homepage";
import AdminServices from "./pages/Services";
import AdminPackages from "./pages/Packages";
import AdminAreas from "./pages/Areas";
import AdminReviews from "./pages/Reviews";
import AdminFaqs from "./pages/Faqs";
import AdminBlog from "./pages/Blog";
import AdminLeads from "./pages/Leads";
import AdminMedia from "./pages/MediaLibrary";
import AdminAppearance from "./pages/Appearance";
import AdminSettings from "./pages/Settings";
import AdminAccount from "./pages/Account";

/**
 * AdminRoutes
 * -------------
 * Everything under /admin/*. Mounted once in App.js, wrapped in its own
 * auth provider so admin session state never touches the public site's
 * component tree.
 */
export default function AdminRoutes() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route path="" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="homepage" element={<ProtectedRoute><AdminHomepage /></ProtectedRoute>} />
        <Route path="services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
        <Route path="packages" element={<ProtectedRoute><AdminPackages /></ProtectedRoute>} />
        <Route path="areas" element={<ProtectedRoute><AdminAreas /></ProtectedRoute>} />
        <Route path="reviews" element={<ProtectedRoute><AdminReviews /></ProtectedRoute>} />
        <Route path="faqs" element={<ProtectedRoute><AdminFaqs /></ProtectedRoute>} />
        <Route path="blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
        <Route path="leads" element={<ProtectedRoute><AdminLeads /></ProtectedRoute>} />
        <Route path="media" element={<ProtectedRoute><AdminMedia /></ProtectedRoute>} />
        <Route path="appearance" element={<ProtectedRoute><AdminAppearance /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
        <Route path="account" element={<ProtectedRoute><AdminAccount /></ProtectedRoute>} />
      </Routes>
    </AdminAuthProvider>
  );
}
