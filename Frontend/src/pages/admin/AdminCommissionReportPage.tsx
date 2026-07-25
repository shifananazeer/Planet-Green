import {
  useEffect,
  useState,
} from "react";

import {
  getCommissionReport,
} from "../../services/commissionService";

export default function AdminCommissionReportPage() {
  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState<any[]>([]);

  const fetchData =
    async () => {
      try {
        const res =
          await getCommissionReport();

        if (res.success) {
          setData(res.data);
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

  const totalCommission =
    data.reduce(
      (sum, item: any) =>
        sum + item.amount,
      0
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-lg font-medium">
          Loading Commission Report...
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 space-y-4">
      {/* Header */}

      <div className="bg-white rounded-xl shadow p-4">
        <h1 className="text-xl md:text-2xl font-bold">
          Commission Report
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Track all MLM commission payouts
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Total Records
          </p>

          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            {data.length}
          </h2>
        </div>

        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Total Paid
          </p>

          <h2 className="text-xl md:text-2xl font-bold text-green-600">
            ₹
            {totalCommission.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Desktop Table */}

      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left">
                  Date
                </th>

                <th className="p-3 text-left">
                  Buyer
                </th>

                <th className="p-3 text-left">
                  Receiver
                </th>

                <th className="p-3 text-left">
                  Level
                </th>

                <th className="p-3 text-left">
                  Amount
                </th>

                <th className="p-3 text-left">
                  Order
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map(
                (item: any) => (
                  <tr
                    key={item._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3">
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      {item.buyer?.name}
                    </td>

                    <td className="p-3">
                      {item.user?.name}
                    </td>

                    <td className="p-3">
                      Level {item.level}
                    </td>

                    <td className="p-3 text-green-600 font-semibold">
                      ₹{item.amount}
                    </td>

                    <td className="p-3">
                      <div>
                        <div className="font-medium">
                          #
                          {item.order?._id?.slice(
                            -6
                          )}
                        </div>

                        <div className="text-xs text-gray-500">
                          ₹
                          {
                            item.order
                              ?.totalAmount
                          }
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}

      <div className="md:hidden space-y-3">
        {data.map(
          (item: any) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {
                      item.user
                        ?.name
                    }
                  </p>

                  <p className="text-xs text-gray-500">
                    Receiver
                  </p>
                </div>

                <div className="text-green-600 font-bold">
                  ₹
                  {
                    item.amount
                  }
                </div>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <div>
                  <span className="font-medium">
                    Buyer:
                  </span>{" "}
                  {
                    item.buyer
                      ?.name
                  }
                </div>

                <div>
                  <span className="font-medium">
                    Level:
                  </span>{" "}
                  {
                    item.level
                  }
                </div>

                <div>
                  <span className="font-medium">
                    Order:
                  </span>{" "}
                  #
                  {item.order?._id?.slice(
                    -6
                  )}
                </div>

                <div>
                  <span className="font-medium">
                    Order Amount:
                  </span>{" "}
                  ₹
                  {
                    item.order
                      ?.totalAmount
                  }
                </div>

                <div>
                  <span className="font-medium">
                    Date:
                  </span>{" "}
                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Empty State */}

      {data.length === 0 && (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
          No commission records found
        </div>
      )}
    </div>
  );
}