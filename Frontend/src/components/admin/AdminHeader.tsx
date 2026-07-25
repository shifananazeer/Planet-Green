import { Menu, LogOut, Bell } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { logout } from "../../services/authService";
import ConfirmModal from "../ConfirmModal";

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export default function AdminHeader({
  onMenuClick,
}: AdminHeaderProps) {
  const navigate = useNavigate();

const [showLogoutModal, setShowLogoutModal] =
  useState(false);

const [logoutLoading, setLogoutLoading] =
  useState(false);

  const handleLogout = async () => {
  try {
    setLogoutLoading(true);

    await logout();

    localStorage.clear();
    sessionStorage.clear();

    navigate("/login");
  } catch (error) {
    console.log(error);
  } finally {
    setLogoutLoading(false);
    setShowLogoutModal(false);
  }
};

  return (
    <header
      className="
      fixed
      top-0
      left-0
      right-0
      h-16
      bg-white
      border-b
      border-gray-200
      shadow-sm
      z-30
      px-4
      lg:px-6
      flex
      items-center
      justify-between
    "
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">

        <button
          onClick={onMenuClick}
          className="
          lg:hidden
          p-2
          rounded-lg
          hover:bg-gray-100
          "
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-800 ">
            Green Planet
          </h1>

          <p className="hidden sm:block text-xs text-gray-500">
            Admin Dashboard
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">

        {/* Notification */}
        <button
          className="
          relative
          p-2
          rounded-lg
          hover:bg-gray-100
          "
        >
          <Bell size={20} />

          <span
            className="
            absolute
            top-1
            right-1
            w-2
            h-2
            bg-red-500
            rounded-full
            "
          />
        </button>

        {/* Admin Profile */}
        <div className="hidden sm:flex items-center gap-2">
          <div
            className="
            w-9
            h-9
            rounded-full
            bg-green-600
            text-white
            flex
            items-center
            justify-center
            font-semibold
            "
          >
            A
          </div>

          <div>
            <p className="text-sm font-medium">
              Admin
            </p>
            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>
        </div>

        {/* Logout */}
      <button
  onClick={() =>
    setShowLogoutModal(true)
  }
  className="
    flex
    items-center
    gap-2
    bg-red-500
    hover:bg-red-600
    text-white
    px-3
    py-2
    rounded-lg
    transition
  "
>
  <LogOut size={16} />

  <span className="hidden sm:inline">
    Logout
  </span>
</button>
      </div>

      <ConfirmModal
  open={showLogoutModal}
  title="Admin Logout"
  message="Are you sure you want to logout from the admin panel?"
  confirmText="Logout"
  loading={logoutLoading}
  onCancel={() =>
    setShowLogoutModal(false)
  }
  onConfirm={handleLogout}
/>
    </header>
  );
}