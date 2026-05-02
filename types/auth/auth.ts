export type LoginRequest = {
  schoolEmail: string;
  password: string;
};

export type LoginResponseData = {
  accessToken: string;
  refreshToken: string;
  userId: number;
  matching: boolean;
  tokenType: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type SignupRequest = {
  schoolEmail: string;
  password: string;
  name: string;
  studentId: string;
  department: string;
};

export type SignupResponseData = {
  email: string;
};

export type VerifyEmailRequest = {
  token: string;
};

export type ResendVerificationRequest = {
  schoolEmail: string;
};
