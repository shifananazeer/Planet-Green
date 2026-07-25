import { useEffect, useState } from "react";
import {
  getPurchaseSetting,
  updatePurchaseSetting,
} from "../../services/adminService";
import CommissionSettings from "../../components/admin/CommissionSettings";
export default function PurchaseSettingsPage() {
  const [amount, setAmount] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchSetting();
  }, []);

  const fetchSetting = async () => {
    try {
      const data =
        await getPurchaseSetting();

      setAmount(
        data.setting
          ?.minimumPurchaseAmount || ""
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await updatePurchaseSetting({
        minimumPurchaseAmount:
          Number(amount),
      });

      alert(
        "Purchase setting updated successfully"
      );
    } catch (error) {
      console.log(error);
      alert("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-2xl shadow p-6">

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Purchase Settings
          </h1>

          <p className="text-gray-500 mb-6">
            Set the minimum purchase
            amount required for users
            to place an order.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Purchase Amount
            </label>

            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              placeholder="Enter amount"
              className="
                w-full
                border
                rounded-xl
                px-4
                py-3
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
              "
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="
              mt-6
              w-full
              bg-green-600
              hover:bg-green-700
              text-white
              py-3
              rounded-xl
              font-semibold
              disabled:opacity-50
            "
          >
            {loading
              ? "Saving..."
              : "Save Settings"}
          </button>

        </div>
      </div>
       <div className="p-6">
      <CommissionSettings />
    </div>
    </div>
  );
}