import {
  useEffect,
  useState,
} from "react";

import {
  Users,
  ShoppingBag,
  IndianRupee,
  Package,
  Wallet,
  TrendingUp,
} from "lucide-react";

import {
  getDashboardStats,
  getRecentOrders,
  getRecentUsers,
  getRecentCommissions,
} from "../../services/adminService";

export default function AdminDashboard() {
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState<any>({});

  const [recentOrders,
    setRecentOrders] =
    useState([]);

  const [recentUsers,
    setRecentUsers] =
    useState([]);

  const [recentCommissions,
    setRecentCommissions] =
    useState([]);

  const fetchData =
    async () => {
      try {
        const [
          statsRes,
          ordersRes,
          usersRes,
          commissionRes,
        ] =
          await Promise.all([
            getDashboardStats(),
            getRecentOrders(),
            getRecentUsers(),
            getRecentCommissions(),
          ]);

        setStats(
          statsRes.data
        );

        setRecentOrders(
          ordersRes.data
        );

        setRecentUsers(
          usersRes.data
        );

        setRecentCommissions(
          commissionRes.data
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading Dashboard...
      </div>
    );
  }

  const cards = [
    {
      title:
        "Total Users",
      value:
        stats.totalUsers ||
        0,
      icon: Users,
    },
    {
      title:
        "Active Users",
      value:
        stats.activeUsers ||
        0,
      icon: TrendingUp,
    },
    {
      title:
        "Total Orders",
      value:
        stats.totalOrders ||
        0,
      icon: ShoppingBag,
    },
    {
      title:
        "Total Products",
      value:
        stats.totalProducts ||
        0,
      icon: Package,
    },
    {
      title:
        "Total Sales",
      value: `₹${(
        stats.totalSales ||
        0
      ).toLocaleString()}`,
      icon: IndianRupee,
    },
    {
      title:
        "Commission Paid",
      value: `₹${(
        stats.totalCommissionPaid ||
        0
      ).toLocaleString()}`,
      icon: Wallet,
    },
    {
      title:
        "Wallet Balance",
      value: `₹${(
        stats.totalWalletBalance ||
        0
      ).toLocaleString()}`,
      icon: Wallet,
    },
    {
      title:
        "Categories",
      value:
        stats.totalCategories ||
        0,
      icon: Package,
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500">
          MLM Business Overview
        </p>
      </div>

      {/* Stats Cards */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(
          (
            card,
            index
          ) => {
            const Icon =
              card.icon;

            return (
              <div
                key={
                  index
                }
                className="bg-white rounded-xl shadow p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      {
                        card.title
                      }
                    </p>

                    <h3 className="text-2xl font-bold mt-1">
                      {
                        card.value
                      }
                    </h3>
                  </div>

                  <Icon
                    size={
                      32
                    }
                    className="text-green-600"
                  />
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Recent Sections */}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Recent Users */}

        <div className="bg-white rounded-xl shadow">
          <div className="p-4 border-b">
            <h2 className="font-bold">
              Recent Users
            </h2>
          </div>

          <div className="p-4 space-y-3">
            {recentUsers.map(
              (
                user: any
              ) => (
                <div
                  key={
                    user._id
                  }
                  className="flex justify-between"
                >
                  <span>
                    {
                      user.name
                    }
                  </span>

                  <span className="text-xs text-gray-500">
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Recent Orders */}

        <div className="bg-white rounded-xl shadow">
          <div className="p-4 border-b">
            <h2 className="font-bold">
              Recent Orders
            </h2>
          </div>

          <div className="p-4 space-y-3">
            {recentOrders.map(
              (
                order: any
              ) => (
                <div
                  key={
                    order._id
                  }
                  className="flex justify-between"
                >
                  <span>
                    {
                      order
                        .user
                        ?.name
                    }
                  </span>

                  <span className="font-semibold text-green-600">
                    ₹
                    {
                      order.totalAmount
                    }
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Recent Commissions */}

        <div className="bg-white rounded-xl shadow">
          <div className="p-4 border-b">
            <h2 className="font-bold">
              Recent Commissions
            </h2>
          </div>

          <div className="p-4 space-y-3">
            {recentCommissions.map(
              (
                item: any
              ) => (
                <div
                  key={
                    item._id
                  }
                  className="flex justify-between"
                >
                  <span>
                    {
                      item.user
                        ?.name
                    }
                  </span>

                  <span className="font-semibold text-green-600">
                    ₹
                    {
                      item.amount
                    }
                  </span>
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}