import React, { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard, Inbox, Home, Wrench, Package, MapPin, Star, HelpCircle,
  Newspaper, Image, Palette, Settings as SettingsIcon, LogOut, Menu, X, ExternalLink,
} from "lucide-react";
import { useAdminAuth } from "../AuthContext";

const NAV = [
  { section: null, items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true }] },
  {
    section: "Content",
    items: [
      { to: "/admin/homepage", label: "Homepage", icon: Home },
      { to: "/admin/services", label: "Services", icon: Wrench },
      { to: "/admin/packages", label: "Packages", icon: Package },
      { to: "/admin/areas", label: "Service Areas", icon: MapPin },
      { to: "/admin/reviews", label: "Reviews", icon: Star },
      { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
      { to: "/admin/blog", label: "Blog", icon: Newspaper },
    ],
  },
  { section: "Business", items: [{ to: "/admin/leads", label: "Leads", icon: Inbox }] },
  {
    section: "Website",
    items: [
      { to: "/admin/media", label: "Media", icon: Image },
      { to: "/admin/appearance", label: "Appearance", icon: Palette },
      { to: "/admin/settings", label: "Website Settings", icon: SettingsIcon },
    ],
  },
];

function SidebarContent({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-6 px-3">
      {NAV.map((group, i) => (
        <div key={i}>
          {group.section && (
            <div className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {group.section}
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            {group.items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function AdminLayout({ children, title }) {
  const { admin, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 border-r border-slate-200 bg-white">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-slate-200">
          <span className="w-2 h-2 rounded-full bg-cyan-500" />
          <span className="font-bold tracking-tight">Horizon Admin</span>
        </div>
        <div className="flex-1 overflow-y-auto py-5">
          <SidebarContent />
        </div>
        <div className="border-t border-slate-200 p-3 space-y-1">
          <Link to="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">
            <ExternalLink className="w-4 h-4" /> View site
          </Link>
          <Link to="/admin/account" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">
            <SettingsIcon className="w-4 h-4" /> Account
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white flex flex-col">
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200">
              <span className="font-bold">Horizon Admin</span>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto py-5">
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="border-t border-slate-200 p-3">
              <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-slate-200 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
            <h1 className="text-lg font-bold">{title}</h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">{admin?.username}</div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
