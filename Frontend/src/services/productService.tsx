import {api} from "./api";

export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const createProduct = async (
  data: FormData
) => {
  const res = await api.post(
    "/products",
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const deleteProduct = async (
  id: string
) => {
  const res = await api.delete(
    `/products/${id}`
  );

  return res.data;
};


export const updateProduct = async (
  id: string,
  data: FormData
) => {
  const res = await api.put(
    `/products/${id}`,
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};


export const getProductById =
  async (id: string) => {
    const { data } =
      await api.get(
        `/products/${id}`
      );

    return data;
  };


  export const addToCart = async (
  data: {
    productId: string;
    quantity: number;
  }
) => {
  const response = await api.post(
    "/products/cart/add",
    data
  );

  return response.data;
};


export const getCart = async () => {
  try {
    console.log(
      "Fetching Cart..."
    );

    const response =
      await api.get(
        "/products/cart"
      );

    console.log(
      "Cart Response:",
      response.data
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Get Cart Service Error:",
      error?.response?.data ||
        error.message
    );

    throw error;
  }
};
export const removeFromCart = async (
  productId: string
) => {
  const response = await api.delete(
    `/products/cart/remove/${productId}`
  );

  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete(
    "/cart/clear"
  );

  return response.data;
};

export const updateCartQuantity =
  async (
    productId: string,
    action:
      | "increment"
      | "decrement"
  ) => {
    const response =
      await api.put(
        `/products/cart/${productId}`,
        { action }
      );

    return response.data;
  };