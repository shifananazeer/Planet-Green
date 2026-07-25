import {api} from "./api";

export const getWalletDashboard =
  async () => {
    const res = await api.get(
      "/wallet/dashboard"
    );

    return res.data;
  };

export const getCommissionHistory =
  async () => {
    const res = await api.get(
      "/wallet/commissions"
    );

    return res.data;
  };

export const getWalletSummary =
  async () => {
    const res = await api.get(
      "/wallet/summary"
    );

    return res.data;
  };


  export const getTransactions =
  async () => {
    const response =
      await api.get(
        "/wallet/transactions"
      );

    return response.data;
  };