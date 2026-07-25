import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/adminService";

export default function AdminOrdersPage() {
  const [orders, setOrders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

    const [search, setSearch] =
  useState("");

const [paymentFilter,
  setPaymentFilter] =
  useState("all");

const [statusFilter,
  setStatusFilter] =
  useState("all");

const [selectedOrder,
  setSelectedOrder] =
  useState<any>(null);

const [dateFilter,
  setDateFilter] =
  useState("");

  const fetchOrders =
    async () => {
      try {
        const res =
          await getAllOrders();

        if (res.success) {
          setOrders(res.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange =
    async (
      orderId: string,
      status: string
    ) => {
      try {
        await updateOrderStatus(
          orderId,
          status
        );

        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  orderStatus:
                    status,
                }
              : order
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

  const totalSales =
    orders.reduce(
      (sum, order) =>
        sum +
        (order.totalAmount ||
          0),
      0
    );

  const paidOrders =
    orders.filter(
      (o) =>
        o.paymentStatus ===
        "paid"
    ).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-medium">
          Loading Orders...
        </p>
      </div>
    );
  }

  const filteredOrders = orders.filter(
  (order) => {
    const matchesSearch =
      order.user?.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const matchesPayment =
      paymentFilter === "all" ||
      order.paymentStatus ===
        paymentFilter;

    const matchesStatus =
      statusFilter === "all" ||
      order.orderStatus ===
        statusFilter;

    const matchesDate =
      !dateFilter ||
      new Date(order.createdAt)
        .toISOString()
        .split("T")[0] ===
        dateFilter;

    return (
      matchesSearch &&
      matchesPayment &&
      matchesStatus &&
      matchesDate
    );
  }
);

  return (
    <div className="p-3 md:p-6 space-y-4">
      {/* Header */}

      <div className="bg-white rounded-xl shadow p-4">
        <h1 className="text-2xl font-bold">
          Orders Management
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          View and manage
          customer orders
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <h2 className="text-2xl font-bold text-blue-600">
            {orders.length}
          </h2>
        </div>

        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Total Sales
          </p>

          <h2 className="text-2xl font-bold text-green-600">
            ₹
            {totalSales.toLocaleString()}
          </h2>
        </div>

        <div className="bg-purple-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Paid Orders
          </p>

          <h2 className="text-2xl font-bold text-purple-600">
            {paidOrders}
          </h2>
        </div>

        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Processing
          </p>

          <h2 className="text-2xl font-bold text-orange-600">
            {
              orders.filter(
                (o) =>
                  o.orderStatus ===
                  "processing"
              ).length
            }
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
  <div className="grid md:grid-cols-4 gap-3">

    <input
      type="text"
      placeholder="Search customer..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      className="border rounded-lg px-3 py-2"
    />

    <input
      type="date"
      value={dateFilter}
      onChange={(e) =>
        setDateFilter(
          e.target.value
        )
      }
      className="border rounded-lg px-3 py-2"
    />

    <select
      value={paymentFilter}
      onChange={(e) =>
        setPaymentFilter(
          e.target.value
        )
      }
      className="border rounded-lg px-3 py-2"
    >
      <option value="all">
        All Payments
      </option>

      <option value="paid">
        Paid
      </option>

      <option value="pending">
        Pending
      </option>
    </select>

    <select
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(
          e.target.value
        )
      }
      className="border rounded-lg px-3 py-2"
    >
      <option value="all">
        All Status
      </option>

      <option value="pending">
        Pending
      </option>

      <option value="processing">
        Processing
      </option>

      <option value="shipped">
        Shipped
      </option>

      <option value="delivered">
        Delivered
      </option>

      <option value="cancelled">
        Cancelled
      </option>
    </select>
  </div>
</div>

      {/* Desktop Table */}

      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">
                  Order
                </th>

                <th className="p-3 text-left">
                  Customer
                </th>

                <th className="p-3 text-left">
                  Amount
                </th>

                <th className="p-3 text-left">
                  Payment
                </th>

                <th className="p-3 text-left">
                  Status
                </th>

                <th className="p-3 text-left">
                  Date
                </th>
                <th className="p-3 text-left">
                    Action
                    </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map(
                (order) => (
                  <tr
                    key={
                      order._id
                    }
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3">
                      #
                      {order._id.slice(
                        -6
                      )}
                    </td>

                    <td className="p-3">
                      <div>
                        <p className="font-medium">
                          {
                            order
                              .user
                              ?.name
                          }
                        </p>

                        <p className="text-xs text-gray-500">
                          {
                            order
                              .user
                              ?.email
                          }
                        </p>
                      </div>
                    </td>

                    <td className="p-3 font-semibold text-green-600">
                      ₹
                      {
                        order.totalAmount
                      }
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus ===
                          "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {
                          order.paymentStatus
                        }
                      </span>
                    </td>

                    <td className="p-3">
                      <select
                        value={
                          order.orderStatus
                        }
                        onChange={(
                          e
                        ) =>
                          handleStatusChange(
                            order._id,
                            e
                              .target
                              .value
                          )
                        }
                        className="border rounded-lg px-3 py-2"
                      >
                        <option value="pending">
                          Pending
                        </option>

                        <option value="processing">
                          Processing
                        </option>

                        <option value="shipped">
                          Shipped
                        </option>

                        <option value="delivered">
                          Delivered
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>
                      </select>
                    </td>

                    <td className="p-3">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                        <button
                            onClick={() =>
                            setSelectedOrder(order)
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                        >
                            View
                        </button>
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
        {filteredOrders.map(
          (order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-4"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">
                    #
                    {order._id.slice(
                      -6
                    )}
                  </p>

                  <p className="text-sm text-gray-500">
                    {
                      order.user
                        ?.name
                    }
                  </p>
                </div>

                <div className="text-green-600 font-bold">
                  ₹
                  {
                    order.totalAmount
                  }
                </div>
              </div>

              <div className="mt-3 space-y-2 text-sm">
                <div>
                  Payment:
                  <span className="ml-2 font-medium">
                    {
                      order.paymentStatus
                    }
                  </span>
                </div>

                <div>
                  Date:
                  <span className="ml-2">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
                  <button
                    onClick={() =>
                        setSelectedOrder(order)
                    }
                    className="w-full mt-3 bg-blue-500 text-white py-2 rounded-lg"
                    >
                    View Order
                    </button>
                <div>
                  Status:
                </div>

                <select
                  value={
                    order.orderStatus
                  }
                  onChange={(
                    e
                  ) =>
                    handleStatusChange(
                      order._id,
                      e.target
                        .value
                    )
                  }
                  className="w-full border rounded-lg p-2"
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="processing">
                    Processing
                  </option>

                  <option value="shipped">
                    Shipped
                  </option>

                  <option value="delivered">
                    Delivered
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>
            </div>
          )
        )}
      </div>

      {/* Empty State */}

      {orders.length === 0 && (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <p className="text-gray-500">
            No orders found
          </p>
        </div>
      )}

      {selectedOrder && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">

      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">
          Order Details
        </h2>

        <button
          onClick={() =>
            setSelectedOrder(null)
          }
          className="text-xl"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-3">

        <div>
          <strong>
            Customer:
          </strong>{" "}
          {
            selectedOrder.user
              ?.name
          }
        </div>

        <div>
          <strong>Email:</strong>{" "}
          {
            selectedOrder.user
              ?.email
          }
        </div>

        <div>
          <strong>
            Total Amount:
          </strong>{" "}
          ₹
          {
            selectedOrder.totalAmount
          }
        </div>

        <div>
          <strong>
            Payment:
          </strong>{" "}
          {
            selectedOrder.paymentStatus
          }
        </div>

        <div>
          <strong>
            Status:
          </strong>{" "}
          {
            selectedOrder.orderStatus
          }
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">
            Products
          </h3>

          {selectedOrder.items?.map(
            (
              item: any,
              index: number
            ) => (
              <div
                key={index}
                className="border rounded-lg p-3 mb-2"
              >
                <div className="font-medium">
                  {
                    item.product
                      ?.name
                  }
                </div>

                <div className="text-sm text-gray-500">
                  Qty:
                  {" "}
                  {
                    item.quantity
                  }
                </div>

                <div className="text-sm text-green-600">
                  ₹
                  {
                    item.price
                  }
                </div>

                {item.product
                  ?.images?.[0] && (
                  <img
                    src={
                      item
                        .product
                        .images[0]
                    }
                    alt=""
                    className="w-16 h-16 object-cover rounded mt-2"
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}