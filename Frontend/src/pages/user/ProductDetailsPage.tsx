import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getProductById , addToCart  , removeFromCart , getCart} from "../../services/productService";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category?: {
    _id: string;
    name: string;
  };
}

export default function ProductDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [selectedImage, setSelectedImage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

    const [cartLoading, setCartLoading] =
  useState(false);

  const [isInCart, setIsInCart] =
  useState(false);


  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data =
        await getProductById(id!);

      setProduct(data.product);

      if (
        data.product?.images?.length
      ) {
        setSelectedImage(
          data.product.images[0]
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

 const handleAddToCart = async () => {
  if (!product?._id) return;

  try {
    setCartLoading(true);

    await addToCart({
      productId: product._id,
      quantity: 1,
    });

    setIsInCart(true);

  } catch (error) {
    console.log(error);
  } finally {
    setCartLoading(false);
  }
};

useEffect(() => {
  if (product?._id) {
    checkCartStatus();
  }
}, [product]);

const checkCartStatus = async () => {
  try {
    const data = await getCart();

    const exists = data.items.some(
      (item: any) =>
        item.product._id === product?._id
    );

    setIsInCart(exists);
  } catch (error) {
    console.log(error);
  }
};

const handleRemoveFromCart =
  async () => {
    if (!product) return;

    try {
      await removeFromCart(
        product._id
      );

      setIsInCart(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        Product not found
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">

      {/* Back Button */}
      <button
        onClick={() =>
          navigate(-1)
        }
        className="
          flex
          items-center
          gap-2
          mb-6
          text-green-700
          font-medium
        "
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div
        className="
          bg-white
          rounded-3xl
          shadow-lg
          overflow-hidden
          grid
          md:grid-cols-2
          gap-8
          p-6
        "
      >
        {/* Images */}
        <div>

          <img
            src={selectedImage}
            alt={product.name}
            className="
              w-full
              h-[300px]
              md:h-[500px]
              object-cover
              rounded-2xl
              border
            "
          />

          {product.images?.length >
            1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {product.images.map(
                (
                  image,
                  index
                ) => (
                  <img
                    key={index}
                    src={image}
                    alt=""
                    onClick={() =>
                      setSelectedImage(
                        image
                      )
                    }
                    className={`
                      w-20 h-20
                      rounded-xl
                      object-cover
                      border-2
                      cursor-pointer
                      ${
                        selectedImage ===
                        image
                          ? "border-green-600"
                          : "border-gray-200"
                      }
                    `}
                  />
                )
              )}
            </div>
          )}

        </div>

        {/* Product Details */}
        <div>

          <p className="text-green-600 font-medium">
            {product.category?.name}
          </p>

          <h1 className="text-3xl font-bold mt-2">
            {product.name}
          </h1>

          <p className="text-4xl font-bold text-green-700 mt-4">
            ₹{product.price}
          </p>

          <div className="mt-4">
            <span
              className={`
                px-4 py-2 rounded-full text-sm font-medium
                ${
                  product.stock > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
              `}
            >
              {product.stock > 0
                ? `In Stock (${product.stock})`
                : "Out Of Stock"}
            </span>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">
              Description
            </h3>

            <p className="text-gray-600 leading-7">
              {product.description}
            </p>
          </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
<button
  onClick={
    isInCart
      ? handleRemoveFromCart
      : handleAddToCart
  }
  disabled={cartLoading}
  className={`
    w-full
    py-3
    rounded-xl
    font-semibold
    transition
    ${
      isInCart
        ? "bg-red-600 hover:bg-red-700 text-white"
        : "bg-green-600 hover:bg-green-700 text-white"
    }
  `}
>
  {cartLoading
    ? "Please wait..."
    : isInCart
    ? "Remove From Cart"
    : "Add To Cart"}
</button>

    <button
      className="
        border-2
        border-green-600
        text-green-600
        hover:bg-green-50
        py-3
        rounded-xl
        font-semibold
        transition
      "
    >
      ⚡ Buy Now
    </button>

  </div>

        </div>

      </div>

    </div>
  );
}