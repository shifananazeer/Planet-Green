import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";

export default function ProductsPage() {
 const [products, setProducts] =
  useState<Product[]>([]);
    const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data =
        await getProducts();

      setProducts(
        data.products || []
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 md:p-6">

      <h1 className="text-2xl font-bold mb-6">
        Products
      </h1>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-6
        "
      >
       {products.map((product: any) => (
  <div
    key={product._id}
    onClick={() =>
      navigate(`/user/products/${product._id}`)
    }
    className="
      bg-white
      rounded-2xl
      shadow
      overflow-hidden
      cursor-pointer
      hover:shadow-lg
      transition
    "
  >
              <img
                src={
                  product.images?.[0]
                }
                alt={product.name}
                className="
                  w-full
                  h-52
                  object-cover
                "
              />

              <div className="p-4">

                <p className="text-sm text-green-600">
                  {
                    product.category
                      ?.name
                  }
                </p>

                <h3 className="font-bold text-lg">
                  {product.name}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-2">
                  {
                    product.description
                  }
                </p>

                <div className="mt-4 flex justify-between items-center">

                  <span className="font-bold text-xl text-green-700">
                    ₹{product.price}
                  </span>

                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Stock:
                    {product.stock}
                  </span>

                </div>

              </div>
            </div>
          )
        )}
      </div>

    </div>
  );
}