import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-sky-50">

      {/* Header */}
      <AdminHeader
        onMenuClick={() =>
          setSidebarOpen(true)
        }
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed
          top-0
          left-0
          h-screen
          z-50
          transform
          transition-transform
          duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <AdminSidebar
          onClose={() =>
            setSidebarOpen(false)
          }
        />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="pt-20 p-4 md:p-6 min-h-screen mt-10">
          <Outlet />
        </main>
      </div>

    </div>
  );
}