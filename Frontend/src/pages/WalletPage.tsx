import {
  useEffect,
  useState,
} from "react";

import {
  Wallet,
  IndianRupee,
  Users,
} from "lucide-react";

import {
  getWalletDashboard,
} from "../services/walletService";

interface Commission {
  _id: string;
  level: number;
  amount: number;
  buyer?: {
    name: string;
  };
  createdAt: string;
}

interface WalletData {
  walletBalance: number;
  totalEarnings: number;
  totalReferrals: number;
  recentCommissions: Commission[];
}

export default function WalletPage() {
  const [loading, setLoading] =
    useState(true);

  const [walletData, setWalletData] =
    useState<WalletData | null>(
      null
    );

  const fetchWallet = async () => {
    try {
      const res =
        await getWalletDashboard();

      setWalletData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading wallet...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Wallet
      </h1>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-3">
            <Wallet className="text-green-600" />
            <div>
              <p className="text-gray-500">
                Wallet Balance
              </p>
              <h2 className="text-2xl font-bold">
                ₹
                {walletData?.walletBalance?.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-3">
            <IndianRupee className="text-blue-600" />
            <div>
              <p className="text-gray-500">
                Total Earnings
              </p>
              <h2 className="text-2xl font-bold">
                ₹
                {walletData?.totalEarnings?.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center gap-3">
            <Users className="text-purple-600" />
            <div>
              <p className="text-gray-500">
                Referrals
              </p>
              <h2 className="text-2xl font-bold">
                {
                  walletData?.totalReferrals
                }
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Commission History */}

      <div className="bg-white rounded-xl shadow">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">
            Recent Commissions
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3">
                  Date
                </th>
                <th className="p-3">
                  Buyer
                </th>
                <th className="p-3">
                  Level
                </th>
                <th className="p-3">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {walletData?.recentCommissions?.map(
                (item) => (
                  <tr
                    key={item._id}
                    className="border-t"
                  >
                    <td className="p-3">
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      {item.buyer
                        ?.name || "-"}
                    </td>

                    <td className="p-3">
                      Level {item.level}
                    </td>

                    <td className="p-3 font-semibold text-green-600">
                      ₹{item.amount}
                    </td>
                  </tr>
                )
              )}

              {!walletData
                ?.recentCommissions
                ?.length && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    No commissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}