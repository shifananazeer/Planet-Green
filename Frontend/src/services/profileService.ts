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