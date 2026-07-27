import { useEffect, useState } from "react";
import { getMyOrders } from "../../services/userServices";
// import { useNavigate } from "react-router-dom";

interface Order {
  _id: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;

  items: {
    product: {
      _id: string;
      name: string;
      images: string[];
    };
    quantity: number;
    price: number;
  }[];
}

export default function MyOrdersPage() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  // const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data =
        await getMyOrders();

      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 p-4 md:p-6">

      <h1 className="text-3xl font-bold mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h2 className="text-xl font-semibold">
            No Orders Found
          </h2>

          <p className="text-gray-500 mt-2">
            Purchase products to see orders.
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow p-5"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">

                <div>
                  <h3 className="font-bold text-lg">
                    Order #{order._id.slice(-8)}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">

                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                    Payment :
                    {" "}
                    {order.paymentStatus}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                    Status :
                    {" "}
                    {order.orderStatus}
                  </span>

                </div>
              </div>

              <div className="mt-5 space-y-4">

                {order.items.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 border rounded-xl p-3"
                    >
                      <img
                        src={
                          item.product
                            ?.images?.[0]
                        }
                        alt={
                          item.product
                            ?.name
                        }
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {
                            item.product
                              ?.name
                          }
                        </h4>

                        <p className="text-gray-500">
                          Qty :
                          {" "}
                          {item.quantity}
                        </p>
                      </div>

                      <div className="font-bold text-green-700">
                        ₹
                        {item.price *
                          item.quantity}
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="border-t mt-5 pt-4 flex justify-between items-center">

                <p className="font-bold text-lg">
                  Total
                </p>

                <p className="font-bold text-green-700 text-xl">
                  ₹
                  {order.totalAmount}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}