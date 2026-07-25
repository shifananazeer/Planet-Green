import { useEffect, useState } from "react";
import {
  getCart,
 
} from "../../services/productService";
import { checkout , verifyPayment } from "../../services/userServices";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<any[]>([]);
  const [grandTotal, setGrandTotal] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();

      setItems(data.items || []);
      setGrandTotal(
        data.items.reduce(
          (
            total: number,
            item: any
          ) =>
            total +
            item.product.price *
              item.quantity,
          0
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const loadRazorpayScript =
    () => {
      return new Promise(
        (resolve) => {
          const script =
            document.createElement(
              "script"
            );

          script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

          script.onload = () =>
            resolve(true);

          document.body.appendChild(
            script
          );
        }
      );
    };

  const handlePayment =
    async () => {
      try {
        setLoading(true);

        await loadRazorpayScript();

        const data =
          await checkout();

        const options = {
          key: data.key,

          amount:
            data.razorpayOrder
              .amount,

          currency:
            data.razorpayOrder
              .currency,

          name: "Planet Green",

          description:
            "Product Purchase",

          order_id:
            data.razorpayOrder.id,

          handler:
            async (
              response: any
            ) => {
              try {
                await verifyPayment(
                  response
                );

                alert(
                  "Payment Successful"
                );

                navigate(
                  "/user/orders"
                );
              } catch (
                error
              ) {
                console.log(
                  error
                );
              }
            },
        };

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.open();

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-sky-50 p-4 md:p-6">

      <h1 className="text-3xl font-bold mb-6">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Items */}
        <div className="lg:col-span-2 space-y-4">

          {items.map(
            (item: any) => (
              <div
                key={
                  item.product._id
                }
                className="bg-white rounded-2xl p-4 shadow flex gap-4"
              >
                <img
                  src={
                    item.product
                      .images?.[0]
                  }
                  alt={
                    item.product
                      .name
                  }
                  className="w-24 h-24 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-bold">
                    {
                      item.product
                        .name
                    }
                  </h3>

                  <p>
                    Qty :
                    {
                      item.quantity
                    }
                  </p>

                  <p className="text-green-700 font-bold">
                    ₹
                    {(
                      item.product
                        .price *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Summary */}
        <div>

          <div className="bg-white rounded-2xl p-6 shadow sticky top-24">

            <h2 className="text-xl font-bold mb-5">
              Payment Summary
            </h2>

            <div className="flex justify-between mb-3">
              <span>
                Total Products
              </span>

              <span>
                {items.length}
              </span>
            </div>

            <div className="border-t pt-4 flex justify-between text-lg font-bold">
              <span>
                Grand Total
              </span>

              <span className="text-green-700">
                ₹
                {grandTotal.toFixed(
                  2
                )}
              </span>
            </div>

            <button
              onClick={
                handlePayment
              }
              disabled={
                loading
              }
              className="
                w-full
                mt-6
                bg-green-600
                hover:bg-green-700
                text-white
                py-3
                rounded-xl
                font-semibold
              "
            >
              {loading
                ? "Processing..."
                : "Pay Now"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}