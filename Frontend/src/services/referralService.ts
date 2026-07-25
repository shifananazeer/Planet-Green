import { api } from "./api";

export const getMyReferrals = async () => {
  const { data } = await api.get(
    "/referrals/my-referrals"
  );

  return data;
};


export const getReferralTree = async () => {
  const res = await api.get("/referrals/tree");
  return res.data;
};

export const getFullNetworkTree =
  async () => {
    const res = await api.get(
      "/referrals/admin/network-tree"
    );

    return res.data;
  };

  export const getNetworkStats =
  async () => {
    const res = await api.get(
      "/referrals/admin/network-stats"
    );

    return res.data;
  };