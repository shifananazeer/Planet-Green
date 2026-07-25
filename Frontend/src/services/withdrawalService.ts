import {api} from "./api";

export const createWithdrawalRequest =
  async (data: {
    amount: number;
    paymentMethod:
      | "upi"
      | "bank";
  }) => {
    const response =
      await api.post(
        "/withdrawals/request",
        data
      );

    return response.data;
  };

export const getMyWithdrawals =
  async () => {
    const response =
      await api.get(
        "/withdrawals/my"
      );

    return response.data;
  };

export const getAllWithdrawals =
  async () => {
    const response =
      await api.get(
        "/withdrawals/admin/all"
      );

    return response.data;
  };

export const approveWithdrawal =
  async (id: string) => {
    const response =
      await api.put(
        `/withdrawals/admin/${id}/approve`
      );

    return response.data;
  };

export const rejectWithdrawal =
  async (
    id: string,
    remark?: string
  ) => {
    const response =
      await api.put(
        `/withdrawals/admin/${id}/reject`,
        {
          remark,
        }
      );

    return response.data;
  };

export const markWithdrawalPaid =
  async (
    id: string,
    formData: FormData
  ) => {
    const response =
      await api.put(
        `/withdrawals/admin/${id}/paid`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };