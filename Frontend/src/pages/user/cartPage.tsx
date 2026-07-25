import { useEffect, useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import {
  getCart,
  removeFromCart,
  updateCartQuantity
} from "../../services/productService";

import { getPurchaseSetting } from "../../services/adminService";

import { useNavigate } from "react-router-dom";

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] =
    useState<CartItem[]>([]);

  const [loading, setLoading] =
    useState(true);

 const grandTotal = items.reduce(
  (total, item) =>
    total +
    item.product.price * item.quantity,
  0
);
       const navigate = useNavigate();

       const [minimumAmount, setMinimumAmount] =
  useState(0);

  useEffect(() => {
    fetchCart();
     fetchPurchaseSetting();
  }, []);


  const fetchPurchaseSetting =
  async () => {
    try {
      const data =
        await getPurchaseSetting();

      setMinimumAmount(
        data.setting
          ?.minimumPurchaseAmount || 0
      );
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCart = async () => {
    try {
      setLoading(true);

      const data =
        await getCart();

      setItems(data.items || []);
     
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (
    productId: string
  ) => {
    try {
      await removeFromCart(
        productId
      );

      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };


 const handleIncrement = async (
  productId: string
) => {
  try {
    await updateCartQuantity(
      productId,
      "increment"
    );

    setItems((prev) =>
      prev.map((item) =>
        item.product._id === productId
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );

 

  } catch (error) {
    console.log(error);
  }
};

const handleDecrement = async (
  productId: string
) => {
  try {
    await updateCartQuantity(
      productId,
      "decrement"
    );

    

    setItems((prev) =>
      prev
        .map((item) =>
          item.product._id ===
          productId
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );

   

  } catch (error) {
    console.log(error);
  }
};

  if (loading) {
    return (
      <div className="p-6">
        Loading Cart...
      </div>
    );
  }

  return (
    <div
      className="
      min-h-screen
      bg-sky-50
      p-4
      md:p-6
    "
    >
      <h1
        className="
        text-3xl
        font-bold
        text-gray-800
        mb-6
      "
      >
        My Cart
      </h1>

      {items.length === 0 ? (
        <div
          className="
          bg-white
          rounded-2xl
          p-10
          text-center
          shadow
        "
        >
          <h2
            className="
            text-xl
            font-semibold
          "
          >
            Cart is Empty
          </h2>

          <p className="text-gray-500 mt-2">
            Add products to cart
          </p>
        </div>
      ) : (
        <div
          className="
          grid
          lg:grid-cols-3
          gap-6
        "
        >
          {/* Cart Items */}
          <div
            className="
            lg:col-span-2
            space-y-4
          "
          >
            {items.map((item) => (
              <div
                key={item.product._id}
                className="
                bg-white
                rounded-2xl
                p-4
                shadow
                flex
                flex-col
                md:flex-row
                gap-4
              "
              >
                <img
                  src={
                    item.product
                      .images?.[0]
                  }
                  alt={
                    item.product.name
                  }
                  className="
                  w-full
                  md:w-32
                  h-32
                  object-cover
                  rounded-xl
                  "
                />

                <div className="flex-1">
                  <h3
                    className="
                    text-lg
                    font-bold
                  "
                  >
                    {
                      item.product.name
                    }
                  </h3>

                  <p
                    className="
                    text-green-700
                    font-bold
                    mt-2
                  "
                  >
                    ₹
                    {
                      item.product.price
                    }
                  </p>

                  <div
                    className="
                    flex
                    items-center
                    gap-3
                    mt-4
                  "
                  >
                 <button
  onClick={() =>
    handleDecrement(
      item.product._id
    )
  }
  className="
    w-8 h-8
    rounded-full
    border
    flex items-center justify-center
  "
>
  <Minus size={16} />
</button>

<span>
  {item.quantity}
</span>

<button
  onClick={() =>
    handleIncrement(
      item.product._id
    )
  }
  className="
    w-8 h-8
    rounded-full
    border
    flex items-center justify-center
  "
>
  <Plus size={16} />
</button>
                  </div>
                </div>

                <div
                  className="
                  flex
                  flex-col
                  justify-between
                  items-end
                "
                >
                  <button
                    onClick={() =>
                      handleRemove(
                        item.product._id
                      )
                    }
                    className="
                    text-red-500
                    hover:text-red-700
                    "
                  >
                    <Trash2
                      size={20}
                    />
                  </button>

                  <p
                    className="
                    font-bold
                    text-lg
                  "
                  >
                    ₹
                    {(
                      item.product
                        .price *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
         
<div>
  <div
    className="
      bg-white
      rounded-2xl
      p-6
      shadow
      sticky
      top-24
    "
  >
    <h2
      className="
        text-xl
        font-bold
        mb-5
      "
    >
      Order Summary
    </h2>

    <div className="space-y-4">

      <div className="flex justify-between">
        <span className="text-gray-600">
          Products
        </span>

        <span className="font-medium">
          {items.length}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-600">
          Total Quantity
        </span>

        <span className="font-medium">
          {items.reduce(
            (total, item) =>
              total + item.quantity,
            0
          )}
        </span>
      </div>

     <div className="flex justify-between">
  <span className="text-gray-600">
    Minimum Purchase
  </span>

  <span className="font-medium">
    ₹{minimumAmount}
  </span>
</div>

<div className="border-t pt-4 flex justify-between text-lg font-bold">
  <span>
    Grand Total
  </span>

  <span className="text-green-700">
    ₹{grandTotal.toFixed(2)}
  </span>
</div>

{grandTotal < minimumAmount && (
  <div
    className="
      bg-red-50
      border
      border-red-200
      text-red-600
      rounded-xl
      p-3
      text-sm
    "
  >
    Minimum purchase amount is ₹
    {minimumAmount}
    <br />
    Add products worth ₹
    {(
      minimumAmount -
      grandTotal
    ).toFixed(2)}{" "}
    more.
  </div>
)}

{grandTotal >= minimumAmount && (
  <div
    className="
      bg-green-50
      border
      border-green-200
      text-green-700
      rounded-xl
      p-3
      text-sm
    "
  >
    Eligible for checkout.
  </div>
)}
     <button
  disabled={
    grandTotal < minimumAmount
  }
  onClick={() =>
    navigate("/user/checkout")
  }
  className={`
    w-full
    py-3
    rounded-xl
    font-semibold
    transition
    ${
      grandTotal < minimumAmount
        ? "bg-gray-300 cursor-not-allowed text-gray-500"
        : "bg-green-600 hover:bg-green-700 text-white"
    }
  `}
>
  Proceed To Checkout
</button>

    </div>
  </div>
</div>
        </div>
      )}
    </div>
  );
}