"use client";

import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../services/productService";
import { getCategories } from "../../services/categoryService";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: {
    _id: string;
    name: string;
  };
  images: string[];
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [] as File[],
  });

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products || data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.categories || data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category?._id || "",
      images: [],
    });

    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category);

      formData.images.forEach((image) => {
        data.append("images", image);
      });

      if (editingProduct && editingProduct._id) {
        await updateProduct(editingProduct._id, data);
      } else {
        await createProduct(data);
      }

      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        images: [],
      });

      fetchProducts();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage and organize your product catalog
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: "",
              description: "",
              price: "",
              stock: "",
              category: "",
              images: [],
            });
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
        >
          + Add Product
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-slate-700">
                  Image
                </th>
                <th className="p-4 text-left text-sm font-semibold text-slate-700">
                  Product
                </th>
                <th className="p-4 text-left text-sm font-semibold text-slate-700">
                  Category
                </th>
                <th className="p-4 text-left text-sm font-semibold text-slate-700">
                  Description
                </th>
                <th className="p-4 text-left text-sm font-semibold text-slate-700">
                  Price
                </th>
                <th className="p-4 text-left text-sm font-semibold text-slate-700">
                  Stock
                </th>
                <th className="p-4 text-center text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-slate-50 transition-colors duration-200"
                >
                  <td className="p-4">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover shadow-sm"
                      />
                    )}
                  </td>

                  <td className="p-4 font-semibold text-slate-900">
                    {product.name}
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      {product.category?.name}
                    </span>
                  </td>

                  <td className="p-4 text-slate-600 text-sm max-w-xs truncate">
                    {product.description}
                  </td>

                  <td className="p-4 font-bold text-emerald-600">
                    ₹{product.price}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 0
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteId(product._id!)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-slate-200"
          >
            {/* Card Header with Image */}
            <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  No Image
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {product.category?.name}
                </p>
              </div>

              <p className="text-sm text-slate-600 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Price</p>
                  <p className="font-bold text-lg text-emerald-600">
                    ₹{product.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-medium">Stock</p>
                  <p
                    className={`font-bold text-lg ${
                      product.stock > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.stock}
                  </p>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-3 rounded-xl transition-colors duration-200"
                >
                  Edit
                </button>

                <button
                  onClick={() => setDeleteId(product._id!)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-xl transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter product description"
                  className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <select
                  className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Product Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      images: Array.from(e.target.files || []),
                    })
                  }
                />
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        className="w-full h-24 rounded-lg object-cover border border-slate-200"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    setFormData({
                      name: "",
                      description: "",
                      price: "",
                      stock: "",
                      category: "",
                      images: [],
                    });
                  }}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors duration-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-lg font-semibold transition-all duration-200"
                >
                  {loading
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Delete Product
            </h3>

            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors duration-200"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await deleteProduct(deleteId);
                    setDeleteId(null);
                    fetchProducts();
                  } catch (error) {
                    console.log(error);
                  }
                }}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-semibold transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

