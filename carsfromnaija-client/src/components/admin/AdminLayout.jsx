import { useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
import {
  LayoutDashboard,
  CarFront,
  MessageSquare,
  Settings as SettingsIcon,
  Menu,
  X,
  LogOut,
} from "lucide-react";


export default function AdminLayout() {
  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] =
    useState(
      false,
    );
  const location =
    useLocation();

  const navLinks =
    [
      {
        name: "Dashboard",
        path: "/admin",
        icon: (
          <LayoutDashboard
            size={
              20
            }
          />
        ),
      },
      {
        name: "Inventory",
        path: "/admin/inventory",
        icon: (
          <CarFront
            size={
              20
            }
          />
        ),
      },
      {
        name: "Settings",
        path: "/admin/settings",
        icon: (
          <SettingsIcon
            size={
              20
            }
          />
        ),
      },
    ];

  const isActive =
    (
      path,
    ) =>
      location.pathname ===
      path;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <span className="font-bold text-lg tracking-wider">
          DEALER
          ADMIN
        </span>
        <button
          onClick={() =>
            setIsMobileMenuOpen(
              !isMobileMenuOpen,
            )
          }
        >
          {isMobileMenuOpen ? (
            <X
              size={
                24
              }
            />
          ) : (
            <Menu
              size={
                24
              }
            />
          )}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`
        ${isMobileMenuOpen ? "block" : "hidden"} 
        md:block w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 
        md:sticky md:top-0 md:h-screen z-40 transition-all absolute md:relative
      `}
      >
        <div className="p-6 hidden md:block border-b border-slate-800">
          <h2 className="text-xl font-bold text-white tracking-wider">
            DEALER
            ADMIN
          </h2>
        </div>

        <nav className="p-4 space-y-2">
          {navLinks.map(
            (
              link,
            ) => (
              <Link
                key={
                  link.name
                }
                to={
                  link.path
                }
                onClick={() =>
                  setIsMobileMenuOpen(
                    false,
                  )
                }
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(
                    link.path,
                  )
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                {
                  link.icon
                }
                <span className="font-semibold">
                  {
                    link.name
                  }
                </span>
              </Link>
            ),
          )}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors"
          >
            <LogOut
              size={
                20
              }
            />
            <span className="font-semibold">
              Exit
              to
              Public
              Site
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-8 w-full max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
