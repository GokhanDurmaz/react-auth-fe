export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message?: string;
}

export interface ApiError {
  message?: string;
}