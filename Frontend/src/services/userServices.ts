import { api } from "./api";


export const getDashboard =
  async () => {
    const { data } =
      await api.get(
        "/users/dashboard"
      );
 console.log("dashboard" , data)
    return data;
  };


  export const checkout =
  async () => {
    const response =
      await api.post(
        "/users/checkout"
      );

    return response.data;
  };

export const verifyPayment =
  async (data: any) => {
    const response =
      await api.post(
        "/users/verify-payment",
        data
      );

    return response.data;
  };

  export const getMyOrders = async () => {
  const response = await api.get(
    "/users/my-orders"
  );

  return response.data;
};