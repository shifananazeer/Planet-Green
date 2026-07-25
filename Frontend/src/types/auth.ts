export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
  position?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
}