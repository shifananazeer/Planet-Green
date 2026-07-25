import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createWithdrawalRequest,
  getMyWithdrawals,
} from "../../services/withdrawalService";
import { getProfile } from "../../services/profileService";

export default function AdminMyWithdrawalPage() {
  const [user, setUser] =
    useState<any>(null);

  const [withdrawals, setWithdrawals] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [amount, setAmount] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("upi");

  const fetchData = async () => {
    try {
      const [profileRes, withdrawalRes] =
        await Promise.all([
          getProfile(),
          getMyWithdrawals(),
        ]);

      setUser(profileRes.user);
      setWithdrawals(
        withdrawalRes.data || []
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hasWithdrawalDetails =
    user?.upiId ||
    (
      user?.accountHolderName &&
      user?.bankName &&
      user?.accountNumber &&
      user?.ifscCode
    );

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      const withdrawAmount =
        Number(amount);

      if (
        !withdrawAmount ||
        withdrawAmount <= 0
      ) {
        toast.error(
          "Enter valid amount"
        );
        return;
      }

      if (
        withdrawAmount >
        user.walletBalance
      ) {
        toast.error(
          "Amount exceeds wallet balance"
        );
        return;
      }

      if (
        !hasWithdrawalDetails
      ) {
        toast.error(
          "Please add UPI or Bank details first"
        );
        return;
      }

      try {
        setLoading(true);

        const res =
          await createWithdrawalRequest({
            amount:
              withdrawAmount,
            paymentMethod:
              paymentMethod as
                | "upi"
                | "bank",
          });

        if (res.success) {
          toast.success(
            "Withdrawal request submitted"
          );

          setAmount("");

          fetchData();
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to submit request"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* Wallet Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-2xl p-6 shadow-lg">
        <p className="text-sm opacity-80">
          Available Wallet Balance
        </p>

        <h1 className="text-4xl font-bold mt-2">
          ₹
          {user?.walletBalance?.toLocaleString(
            "en-IN"
          ) || 0}
        </h1>
      </div>

      {/* Withdrawal Details */}
      <div
        className={`rounded-xl p-4 ${
          hasWithdrawalDetails
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700"
        }`}
      >
        {hasWithdrawalDetails
          ? "✓ Withdrawal details configured"
          : "⚠ Please add UPI or Bank details in Profile before requesting withdrawal"}
      </div>

      {/* Request Form */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-xl font-bold mb-4">
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
              min="1"
              max={
                user?.walletBalance
              }
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3"
              placeholder={`Maximum ₹${user?.walletBalance || 0}`}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Payment Method
            </label>

            <select
              value={
                paymentMethod
              }
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
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
            disabled={
              loading ||
              !hasWithdrawalDetails
            }
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Submitting..."
              : "Submit Request"}
          </button>
        </form>
      </div>

      {/* Withdrawal History */}
      <div className="bg-white rounded-2xl shadow">
        <div className="p-5 border-b">
          <h2 className="text-xl font-bold">
            Withdrawal History
          </h2>
        </div>

        <div className="overflow-x-auto">
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
                (item) => (
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
                        className={`px-3 py-1 rounded-full text-xs ${
                          item.status ===
                          "paid"
                            ? "bg-green-100 text-green-700"
                            : item.status ===
                              "approved"
                            ? "bg-blue-100 text-blue-700"
                            : item.status ===
                              "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
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
      </div>

    </div>
  );
}