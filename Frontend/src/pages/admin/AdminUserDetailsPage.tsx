import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  Users,
  Wallet,
  IndianRupee,
  ShoppingCart,
} from "lucide-react";

import {
  getUserDetails,
} from "../../services/adminService";

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AdminUserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState<any>(null);

  const fetchUser =
    async () => {
      try {
        const res =
          await getUserDetails(
            id!
          );

        if (
          res.success
        ) {
          setData(
            res.data
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

 if (!data) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-red-600">
          User data not found
        </h2>
      </div>
    </div>
  );
}

  const user = data;
  return (
    <div className="p-4 md:p-6 space-y-6">
<div className="flex items-center">
  <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow hover:bg-gray-50"
  >
    <ArrowLeft size={18} />
    Back
  </button>
</div>
      <div className="bg-white rounded-xl shadow p-6">
        

        <div className="flex flex-col md:flex-row gap-4 items-center">

         <img
  src={
    user?.profileImage ||
    "/avatar.png"
  }
  alt={user?.name}
  className="w-24 h-24 rounded-full object-cover border"
/>

          <div>
            <h1 className="text-2xl font-bold">
              {user.name}
            </h1>

            <p>
              {user.email}
            </p>

            <p>
              {
                user.mobile
              }
            </p>

            <p className="text-blue-600">
              Ref:
              {
                user.referralCode
              }
            </p>
          </div>

        </div>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-xl shadow">
          <Wallet />
          <h3 className="text-sm text-gray-500">
            Wallet
          </h3>
          <p className="text-xl font-bold">
            ₹
            {user.walletBalance}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <IndianRupee />
          <h3 className="text-sm text-gray-500">
            Earnings
          </h3>
          <p className="text-xl font-bold">
            ₹
            {user.totalEarnings}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <Users />
          <h3 className="text-sm text-gray-500">
            Referrals
          </h3>
          <p className="text-xl font-bold">
            {
              user.totalReferrals
            }
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <ShoppingCart />
          <h3 className="text-sm text-gray-500">
            Orders
          </h3>
          <p className="text-xl font-bold">
            {
              data.orders
                ?.length
            }
          </p>
        </div>

      </div>

      {/* Direct Referrals */}

      <div className="bg-white rounded-xl shadow">

        <div className="p-4 border-b">
          <h2 className="font-semibold">
            Direct Referrals
          </h2>
        </div>

        <div className="p-4">

          {user.directReferrals?.map(
            (item: any) => (
              <div
                key={item._id}
                className="border rounded-lg p-3 mb-2"
              >
                <p className="font-medium">
                  {
                    item.name
                  }
                </p>

                <p className="text-sm text-gray-500">
                  {
                    item.referralCode
                  }
                </p>
              </div>
            )
          )}

        </div>

      </div>

      {/* Recent Orders */}

      <div className="bg-white rounded-xl shadow">

        <div className="p-4 border-b">
          <h2 className="font-semibold">
            Recent Orders
          </h2>
        </div>

        <div className="p-4">

          {data.orders
            ?.slice(0, 5)
            .map(
              (
                order: any
              ) => (
                <div
                  key={
                    order._id
                  }
                  className="border rounded-lg p-3 mb-2"
                >
                  <p>
                    Order #
                    {order._id.slice(
                      -6
                    )}
                  </p>

                  <p>
                    ₹
                    {
                      order.totalAmount
                    }
                  </p>

                  <p>
                    {
                      order.orderStatus
                    }
                  </p>
                </div>
              )
            )}

        </div>

      </div>

    </div>
  );
}