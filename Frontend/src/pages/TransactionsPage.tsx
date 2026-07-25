import {
  useEffect,
  useState,
} from "react";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  Search,
} from "lucide-react";

import {
  getTransactions,
} from "../services/walletService";

interface Transaction {
  _id: string;
  type: string;
  transactionType:
    | "credit"
    | "debit";
  amount: number;
  description: string;
  balanceAfter: number;
  createdAt: string;
}

export default function TransactionsPage() {
  const [loading, setLoading] =
    useState(true);

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const fetchTransactions =
    async () => {
      try {
        const res =
          await getTransactions();

        if (res.success) {
          setTransactions(
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
    fetchTransactions();
  }, []);

  const filteredData =
    transactions.filter(
      (item) => {
        const matchSearch =
          item.description
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchFilter =
          filter === "all"
            ? true
            : item.transactionType ===
              filter;

        return (
          matchSearch &&
          matchFilter
        );
      }
    );

  if (loading) {
    return (
      <div className="p-6">
        Loading Transactions...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold">
          Wallet Transactions
        </h1>

        <p className="text-gray-500">
          View all wallet credits
          and debits
        </p>
      </div>

      {/* Filters */}

      <div className="bg-white rounded-xl shadow p-4">

        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search transaction..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full border rounded-lg pl-10 pr-4 py-2"
            />
          </div>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value
              )
            }
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">
              All
            </option>

            <option value="credit">
              Credits
            </option>

            <option value="debit">
              Debits
            </option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}

      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">

        <div className="p-4 border-b">
          <h2 className="font-semibold">
            Transaction History
          </h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">

              <th className="p-3 text-left">
                Date
              </th>

              <th className="p-3 text-left">
                Type
              </th>

              <th className="p-3 text-left">
                Description
              </th>

              <th className="p-3 text-left">
                Amount
              </th>

              <th className="p-3 text-left">
                Balance
              </th>

            </tr>
          </thead>

          <tbody>
            {filteredData.map(
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

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.transactionType ===
                        "credit"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {
                        item.transactionType
                      }
                    </span>

                  </td>

                  <td className="p-3">
                    {
                      item.description
                    }
                  </td>

                  <td
                    className={`p-3 font-bold ${
                      item.transactionType ===
                      "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.transactionType ===
                    "credit"
                      ? "+"
                      : "-"}

                    ₹
                    {item.amount.toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td className="p-3">
                    ₹
                    {item.balanceAfter.toLocaleString(
                      "en-IN"
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

      </div>

      {/* Mobile Cards */}

      <div className="md:hidden space-y-3">

        {filteredData.map(
          (item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow p-4"
            >
              <div className="flex justify-between">

                <div className="flex items-center gap-2">

                  {item.transactionType ===
                  "credit" ? (
                    <ArrowUpCircle className="text-green-600" />
                  ) : (
                    <ArrowDownCircle className="text-red-600" />
                  )}

                  <div>
                    <p className="font-medium">
                      {
                        item.description
                      }
                    </p>

                    <p className="text-xs text-gray-500">
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div
                  className={`font-bold ${
                    item.transactionType ===
                    "credit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.transactionType ===
                  "credit"
                    ? "+"
                    : "-"}

                  ₹
                  {item.amount.toLocaleString(
                    "en-IN"
                  )}
                </div>

              </div>

              <div className="mt-3 text-sm text-gray-600">
                Balance After:
                <span className="font-semibold ml-2">
                  ₹
                  {item.balanceAfter.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            </div>
          )
        )}

      </div>

      {!filteredData.length && (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
          No transactions found
        </div>
      )}

    </div>
  );
}