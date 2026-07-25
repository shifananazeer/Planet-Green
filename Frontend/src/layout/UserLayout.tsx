import { Outlet } from "react-router-dom";
import { useState } from "react";
import UserSidebar from "../components/user/UserSidebar";
import UserHeader from "../components/user/UserHeader";

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-sky-60">

      <UserHeader
        onMenuClick={() =>
          setSidebarOpen(true)
        }
      />

      <div className="flex">

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() =>
              setSidebarOpen(false)
            }
          />
        )}

        <div
          className={`
            fixed lg:fixed
            left-0 top-16
            h-[calc(100vh-64px)]
            z-50
            transition-transform
            duration-300
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          <UserSidebar
            onClose={() =>
              setSidebarOpen(false)
            }
          />
        </div>

        <main
          className="
            flex-1
            lg:ml-64
            mt-16
            p-4
            md:p-6
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}