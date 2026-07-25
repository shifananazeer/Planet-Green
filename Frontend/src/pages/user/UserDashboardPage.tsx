import { useEffect, useState } from "react";
import { getDashboard } from "../../services/userServices";

export default function UserDashboardPage() {
  const [dashboard, setDashboard] =
    useState<any>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data =
        await getDashboard();

      setDashboard(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Welcome,
        {dashboard?.user?.name}
      </h1>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-5
        "
      >

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">
            Direct Referrals
          </p>

          <h2 className="text-3xl font-bold text-green-600">
            {
              dashboard?.stats
                ?.directReferrals
            }
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">
            Total Team
          </p>

          <h2 className="text-3xl font-bold text-blue-600">
            {
              dashboard?.stats
                ?.totalReferrals
            }
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">
            Earnings
          </p>

          <h2 className="text-3xl font-bold text-orange-600">
            ₹
            {
              dashboard?.stats
                ?.totalEarnings
            }
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500">
            Referral Code
          </p>

          <h2 className="text-xl font-bold">
            {
              dashboard?.user
                ?.referralCode
            }
          </h2>
        </div>

      </div>

      <div className="bg-white rounded-2xl shadow mt-8 p-5">

        <h2 className="text-xl font-semibold mb-4">
          Recent Referrals
        </h2>

        {dashboard?.recentReferrals?.map(
          (user: any) => (
            <div
              key={user._id}
              className="
                flex
                justify-between
                py-3
                border-b
              "
            >
              <span>
                {user.name}
              </span>

              <span className="text-gray-500">
                {user.email}
              </span>
            </div>
          )
        )}

      </div>

    </div>
  );
}