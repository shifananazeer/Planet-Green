import { api } from "./api";


export const getProfile = async () => {
  const res = await api.get("/profiles/me");
  return res.data;
};

export const updateProfile = async (
  data: FormData
) => {
  const response = await api.put(
    "/profiles/update",
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const changePassword = async (
  data: {
    currentPassword: string;
    newPassword: string;
  }
) => {
  const res = await api.put(
    "/profiles/change-password",
    data
  );

  return res.data;
};