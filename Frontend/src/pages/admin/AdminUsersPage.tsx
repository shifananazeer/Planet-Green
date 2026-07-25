import {
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Users,
  Wallet,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";

import {
  getAllUsers,
  getUserStats,
} from "../../services/adminService";

export default function AdminUsersPage() {
  const [users, setUsers] =
    useState<any[]>([]);

  const [stats, setStats] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const fetchData =
    async () => {
      try {
        const [
          usersRes,
          statsRes,
        ] = await Promise.all([
          getAllUsers(),
          getUserStats(),
        ]);

        if (
          usersRes.success
        ) {
          setUsers(
            usersRes.data
          );
        }

        if (
          statsRes.success
        ) {
          setStats(
            statsRes.data
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers =
    users.filter(
      (user) =>
        user.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        user.email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        user.mobile
          ?.includes(search)
    );

  if (loading) {
    return (
      <div className="p-6">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold">
          User Management
        </h1>

        <p className="text-gray-500">
          Manage all users
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-xl shadow">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" />
            <div>
              <p className="text-gray-500 text-sm">
                Total Users
              </p>
              <h3 className="text-2xl font-bold">
                {
                  stats?.totalUsers
                }
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" />
            <div>
              <p className="text-gray-500 text-sm">
                Active
              </p>
              <h3 className="text-2xl font-bold">
                {
                  stats?.activeUsers
                }
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-600" />
            <div>
              <p className="text-gray-500 text-sm">
                Inactive
              </p>
              <h3 className="text-2xl font-bold">
                {
                  stats?.inactiveUsers
                }
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <div className="flex items-center gap-3">
            <Wallet className="text-purple-600" />
            <div>
              <p className="text-gray-500 text-sm">
                Total Wallet
              </p>
              <h3 className="text-xl font-bold">
                ₹
                {stats?.totalWalletBalance?.toLocaleString(
                  "en-IN"
                )}
              </h3>
            </div>
          </div>
        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-xl shadow p-4">

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full border rounded-lg pl-10 pr-4 py-2"
          />
        </div>

      </div>

      {/* Desktop Table */}

      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">
                User
              </th>

              <th className="p-3 text-left">
                Mobile
              </th>

              <th className="p-3 text-left">
                Referral
              </th>

              <th className="p-3 text-left">
                Wallet
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-left">
                Action
              </th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.map(
              (user) => (
                <tr
                  key={user._id}
                  className="border-t"
                >
                  <td className="p-3">
                    <div>
                      <p className="font-medium">
                        {
                          user.name
                        }
                      </p>

                      <p className="text-sm text-gray-500">
                        {
                          user.email
                        }
                      </p>
                    </div>
                  </td>

                  <td className="p-3">
                    {
                      user.mobile
                    }
                  </td>

                  <td className="p-3">
                    {
                      user.referralCode
                    }
                  </td>

                  <td className="p-3 font-semibold">
                    ₹
                    {user.walletBalance?.toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="p-3">
                    <Link
  to={`/admin/users/${user._id}`}
  className="flex items-center gap-2 text-blue-600"
>
  <Eye size={18} />
  View
</Link>
                  </td>
                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {/* Mobile Cards */}

      <div className="md:hidden space-y-3">

        {filteredUsers.map(
          (user) => (
            <div
              key={user._id}
              className="bg-white rounded-xl shadow p-4"
            >
              <div className="flex justify-between">

                <div>
                  <h3 className="font-semibold">
                    {
                      user.name
                    }
                  </h3>

                  <p className="text-sm text-gray-500">
                    {
                      user.email
                    }
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs h-fit ${
                    user.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.isActive
                    ? "Active"
                    : "Inactive"}
                </span>

              </div>

              <div className="mt-3 space-y-1 text-sm">

                <p>
                  <strong>
                    Mobile:
                  </strong>{" "}
                  {
                    user.mobile
                  }
                </p>

                <p>
                  <strong>
                    Referral:
                  </strong>{" "}
                  {
                    user.referralCode
                  }
                </p>

                <p>
                  <strong>
                    Wallet:
                  </strong>{" "}
                  ₹
                  {user.walletBalance?.toLocaleString(
                    "en-IN"
                  )}
                </p>

              </div>

              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                View User
              </button>

            </div>
          )
        )}

      </div>

    </div>
  );
}