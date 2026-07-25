import { api } from "./api";
import type {
  SignupPayload,
  LoginPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "../types/auth";

export const signup = async (
  data: SignupPayload
) => {
  const response = await api.post(
    "/auth/signup",
    data
  );

  return response.data;
};

export const login = async (
  data: LoginPayload
) => {
  const response = await api.post(
    "/auth/login",
    data
  );
console.log(response)
  return response.data;
};

export const forgotPassword = async (
  data: ForgotPasswordPayload
) => {
  const response = await api.post(
    "/auth/forgot-password",
    data
  );
console.log("token",response.data)
  return response.data;
};

export const resetPassword = async (
  token: string,
  data: ResetPasswordPayload
) => {
  try {
    console.log("Reset Token:", token);
    console.log("Reset Payload:", data);

    const response = await api.post(
      `/auth/reset-password/${token}`,
      data
    );

    console.log(
      "Reset Password Response:",
      response.data
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Reset Password Error:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};



export const logout = async () => {
  const response = await api.post(
    "/auth/logout"
  );

  return response.data;
};