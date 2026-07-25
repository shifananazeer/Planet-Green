import { api } from "./api";
import type { Category } from "../types/category";



// Get all categories
export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};


// Get single category
export const getCategoryById = async (id: string) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};


// Create category
export const createCategory = async (data: FormData | Category) => {
  const response = await api.post(
    "/categories",
    data,
    {
      headers:
        data instanceof FormData
          ? {
              "Content-Type": "multipart/form-data",
            }
          : undefined,
    }
  );

  return response.data;
};


// Update category
export const updateCategory = async (
  id: string,
  data: FormData | Category
) => {
  const response = await api.put(
    `/categories/${id}`,
    data,
    {
      headers:
        data instanceof FormData
          ? {
              "Content-Type": "multipart/form-data",
            }
          : undefined,
    }
  );

  return response.data;
};


// Delete category
export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

