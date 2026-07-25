import {
  LayoutDashboard,
  Users,
  User,
  ShoppingBag,
  LogOut,
  ShoppingCart,
  Wallet,
  Receipt,
} from "lucide-react";
import { useState } from "react";
import {
  Link,
  useLocation, useNavigate
} from "react-router-dom";
import ConfirmModal from "../ConfirmModal";

import { logout } from "../../services/authService";

interface Props {
  onClose: () => void;
}

export default function UserSidebar({
  onClose,
}: Props) {
  const location = useLocation();

  const menus = [
    {
      label: "Dashboard",
      path: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Referrals",
      path: "/user/referrals",
      icon: Users,
    },
    {
  label: "Products",
  path: "/user/products",
  icon: ShoppingBag,
  },
   {
    label: "Cart",
    path: "/user/cart",
    icon: ShoppingCart,
  },
    {
      label: "Orders",
      path: "/user/orders",
      icon: ShoppingBag,
    },
    {
      label: "Network Tree",
      path: "/user/network-tree",
      icon: Users
    },
    {
      label: "Wallet",
      path: "/user/wallet",
      icon: Wallet
    },
    {
      label: "Withdrawals",
      path: "/user/withdrawals",
      icon: Wallet,
    },
    {
      label: "Transactions",
      path: "/user/transactions",
      icon: Receipt,
    },
    {
      label: "Profile",
      path: "/user/profile",
      icon: User,
    },
  ];

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
    <aside
      className="
        w-64
        h-full
        bg-blue-950
        text-white
      "
    >
      <div className=" border-b border-blue-700">

        {/* <h2 className="text-xl font-bold">
          User Panel
        </h2> */}

      </div>

      <nav className="p-2">

        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <Link
              key={menu.path}
              to={menu.path}
              onClick={onClose}
              className={`
                flex items-center gap-3
                px-4 py-3 rounded-xl
                transition
                ${
                  location.pathname ===
                  menu.path
                    ? "bg-blue-400"
                    : "hover:bg-blue-700"
                }
              `}
            >
              <Icon size={20} />
              {menu.label}
            </Link>
          );
        })}

      <button
  onClick={() =>
    setShowLogoutModal(true)
  }
  className="
    w-full
    flex
    items-center
    gap-3
    px-4
    py-3
    rounded-xl
    hover:bg-red-600
    mt-5
  "
>
  <LogOut size={20} />
  Logout
</button>

      </nav>
      <ConfirmModal
  open={showLogoutModal}
  title="Logout"
  message="Are you sure you want to logout from your account?"
  confirmText="Logout"
  loading={logoutLoading}
  onCancel={() =>
    setShowLogoutModal(false)
  }
  onConfirm={handleLogout}
/>
    </aside>
  );
}