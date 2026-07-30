import { useEffect, useState } from "react";
import { getCommissionLevels } from "../../services/commissionService";

export default function CommissionPlans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const res = await getCommissionLevels();

      setPlans(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-4">
        Loading commission plans...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
      <h2 className="text-xl font-bold mb-4">
        Commission Plans
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="border rounded-xl p-4 bg-gray-50 hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500">
              Level
            </p>

            <h3 className="text-2xl font-bold text-blue-600">
              {plan.level}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Commission
            </p>

            <p className="text-lg font-semibold text-green-600">
              ₹{plan.amount}
            </p>

            <span
              className={`inline-block mt-3 px-2 py-1 rounded-full text-xs font-medium ${
                plan.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {plan.isActive
                ? "Active"
                : "Inactive"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}