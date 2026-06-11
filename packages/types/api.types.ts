export type ApiResponse<T> = {
  data?: T;
  message?: string;
  error?: string;
};

export type AuthRedirectPayload = {
  token: string;
  role: 'admin' | 'manager';
  next?: string;
};
