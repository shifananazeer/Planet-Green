import {api} from "./api";

export interface CommissionLevel {
  _id: string;
  level: number;
  amount: number;
  isActive: boolean;
}

export const getCommissionLevels = async () => {
  const res = await api.get("/commission-settings");
  return res.data;
};

export const createCommissionLevel = async (data: {
  level: number;
  amount: number;
}) => {
  const res = await api.post("/commission-settings", data);
  return res.data;
};

export const updateCommissionLevel = async (
  id: string,
  data: {
    amount: number;
    isActive: boolean;
  }
) => {
  const res = await api.put(
    `/commission-settings/${id}`,
    data
  );
  return res.data;
};

export const deleteCommissionLevel = async (
  id: string
) => {
  const res = await api.delete(
    `/commission-settings/${id}`
  );
  return res.data;
};


export const getCommissionReport =
  async () => {
    const res = await api.get(
      "/commission-settings/admin/commission-report"
    );

    return res.data;
  };