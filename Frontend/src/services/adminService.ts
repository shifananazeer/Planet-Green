import {api} from "./api";

export const getPurchaseSetting =
  async () => {
    const response =
      await api.get(
        "/admin/purchase-setting"
      );

    return response.data;
  };

export const updatePurchaseSetting =
  async (data: {
    minimumPurchaseAmount: number;
  }) => {
    const response =
      await api.put(
        "/admin/purchase-setting",
        data
      );

    return response.data;
  };

  export const getAllOrders =
  async () => {
    const res = await api.get(
      "/admin/orders"
    );

    return res.data;
  };

export const updateOrderStatus =
  async (
    orderId: string,
    status: string
  ) => {
    const res = await api.put(
      `/admin/orders/${orderId}/status`,
      {
        orderStatus: status,
      }
    );

    return res.data;
  };


  export const getDashboardStats =
  async () => {
    const { data } =
      await api.get(
        "/admin/dashboard/stats"
      );

    return data;
  };

export const getRecentOrders =
  async () => {
    const { data } =
      await api.get(
        "/admin/dashboard/recent-orders"
      );

    return data;
  };

export const getRecentUsers =
  async () => {
    const { data } =
      await api.get(
        "/admin/dashboard/recent-users"
      );

    return data;
  };

export const getRecentCommissions =
  async () => {
    const { data } =
      await api.get(
        "/admin/dashboard/recent-commissions"
      );

    return data;
  };


  export const getAllUsers = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  const response = await api.get(
    `/admin/users?page=${page}&limit=${limit}&search=${search}`
  );

  return response.data;
};

export const getUserStats =
  async () => {
    const response =
      await api.get(
        "/admin/users/stats"
      );

    return response.data;
  };

export const getUserDetails =
  async (id: string) => {
    const response =
      await api.get(
        `/admin/users/${id}`
      );
console.log("res" , response.data)
    return response.data;
  };

  export const toggleUserStatus =
  async (id: string) => {
    const response =
      await api.put(
        `/admin/users/${id}/toggle-status`
      );

    return response.data;
  };