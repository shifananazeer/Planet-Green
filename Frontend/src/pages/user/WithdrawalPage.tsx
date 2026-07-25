import { useEffect, useState } from "react";
import {
  createWithdrawalRequest,
  getMyWithdrawals,
} from "../../services/withdrawalService";
import { getProfile } from "../../services/profileService";
import toast from "react-hot-toast";

export default function WithdrawalPage() {
  const [loading, setLoading] =
    useState(false);

  const [withdrawals, setWithdrawals] =
    useState([]);

  const [user, setUser] =
    useState<any>(null);

  const [formData, setFormData] =
    useState({
      amount: "",
      paymentMethod: "upi",
    });

  const fetchData = async () => {
    try {
      const [profileRes, historyRes] =
        await Promise.all([
          getProfile(),
          getMyWithdrawals(),
        ]);

      setUser(profileRes.user);
      setWithdrawals(historyRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        setLoading(true);

        const res =
          await createWithdrawalRequest({
            amount: Number(
              formData.amount
            ),
            paymentMethod:
              formData.paymentMethod as
                | "upi"
                | "bank",
          });

        if (res.success) {
          toast.success(
            "Withdrawal request submitted"
          );

          setFormData({
            amount: "",
            paymentMethod:
              "upi",
          });

          fetchData();
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "approved":
        return "bg-blue-100 text-blue-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* Wallet Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-2xl p-6 shadow">

        <p className="text-sm opacity-80">
          Available Balance
        </p>

        <h2 className="text-4xl font-bold mt-2">
          ₹
          {user?.walletBalance?.toFixed(
            2
          ) || "0.00"}
        </h2>

      </div>

      {/* Withdrawal Details Status */}
      <div
        className={`p-4 rounded-xl ${
          user?.upiId ||
          user?.accountNumber
            ? "bg-green-50 text-green-700"
            : "bg-yellow-50 text-yellow-700"
        }`}
      >
        {user?.upiId ||
        user?.accountNumber
          ? "✓ Withdrawal details configured"
          : "⚠ Please add withdrawal details in profile before requesting withdrawals"}
      </div>

      {/* Request Form */}
      <div className="bg-white rounded-2xl shadow p-5">

        <h2 className="text-xl font-bold mb-5">
          Request Withdrawal
        </h2>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-4"
        >
          <div>
            <label className="block mb-2 text-sm font-medium">
              Amount
            </label>

            <input
              type="number"
              value={
                formData.amount
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount:
                    e.target.value,
                })
              }
              className="w-full border rounded-xl p-3"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Payment Method
            </label>

            <select
              value={
                formData.paymentMethod
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentMethod:
                    e.target.value,
                })
              }
              className="w-full border rounded-xl p-3"
            >
              <option value="upi">
                UPI
              </option>

              <option value="bank">
                Bank Transfer
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
          >
            {loading
              ? "Submitting..."
              : "Request Withdrawal"}
          </button>
        </form>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <div className="p-5 border-b">
          <h2 className="text-xl font-bold">
            Withdrawal History
          </h2>
        </div>

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">

          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left">
                  Date
                </th>

                <th className="p-3 text-left">
                  Amount
                </th>

                <th className="p-3 text-left">
                  Method
                </th>

                <th className="p-3 text-left">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {withdrawals.map(
                (
                  item: any
                ) => (
                  <tr
                    key={
                      item._id
                    }
                    className="border-t"
                  >
                    <td className="p-3">
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-3 font-semibold">
                      ₹
                      {
                        item.amount
                      }
                    </td>

                    <td className="p-3 uppercase">
                      {
                        item.paymentMethod
                      }
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {
                          item.status
                        }
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden">

          {withdrawals.map(
            (
              item: any
            ) => (
              <div
                key={
                  item._id
                }
                className="p-4 border-b"
              >
                <div className="flex justify-between">
                  <span className="font-semibold">
                    ₹
                    {
                      item.amount
                    }
                  </span>

                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {
                      item.status
                    }
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  {
                    item.paymentMethod
                  }
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            )
          )}
        </div>

      </div>

    </div>
  );
}