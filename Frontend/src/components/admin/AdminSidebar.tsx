import { Link, useLocation  } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  Share2,
  ShoppingCart,
   UserCircle,
   Wallet,
   BadgeIndianRupee,
   DollarSign,
   Banknote,
  ArrowDownToLine,
  Receipt,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({
  onClose,
}: AdminSidebarProps) {
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      label: "Category",
      path: "/admin/category",
      icon: FolderTree,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: Users,
    },
    
    {
      label: "Orders",
      path: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      label: "Purchase Settings",
      path: "/admin/purchase-settings",
      icon: BadgeIndianRupee,
    },
    {
  label: "Wallet",
  path: "/admin/wallet",
  icon: Banknote,
},
{
  label: "Withdrawals",
  path: "/admin/withdrawals",
  icon: ArrowDownToLine,
},
{
  label: "My Withdrawals",
  path: "/admin/my-withdrawals",
  icon: Wallet,
},
{
      label: "Transactions",
      path: "/user/transactions",
      icon: Receipt,
    },
{
  label: "Network Tree",
  path: "/admin/network-tree",
  icon: Share2,
},
{
  label: "Commission Report",
  path: "/admin/commission-report",
  icon: DollarSign,
},
    {
      label:"Profile",
      path:"/admin/profile",
        icon: UserCircle,
    }
  ];

  return (
   <aside
  className="
    h-screen
    w-64
    bg-blue-950
    text-white
    shadow-xl
    flex
    flex-col
    overflow-hidden
  "
>
      {/* Header */}
      <div className="p-5 border-b border-blue-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">
            Green Planet
          </h1>
          <p className="text-xs text-blue-200 mt-1">
            Admin Panel
          </p>
        </div>

        <button
        onClick={() => onClose?.()}
        className="lg:hidden"
      >
        <X size={22} />
      </button>
      </div>

      {/* Menu */}
    <nav className="flex-1 overflow-y-auto p-4 space-y-2 hide-scrollbar">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => onClose?.()}
              className={`
                flex items-center gap-3
                px-4 py-3
                rounded-xl
                transition-all duration-200
                group
                ${
                  isActive
                    ? "bg-white text-blue-950 shadow-lg"
                    : "text-blue-100 hover:bg-blue-800"
                }
              `}
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-800">
        <div className="bg-blue-800/40 rounded-xl p-3">
          <p className="text-sm font-medium">
            Green Planet
          </p>
          <p className="text-xs text-blue-200 mt-1">
            Admin Management System
          </p>
        </div>
      </div>
    </aside>
  );
}