import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";

export const registerRequest = (payload) => axiosInstance.post(API_PATHS.AUTH.REGISTER, payload);
export const loginRequest = (payload) => axiosInstance.post(API_PATHS.AUTH.LOGIN, payload);
export const getMeRequest = () => axiosInstance.get(API_PATHS.AUTH.ME);
export const forgotPasswordRequest = (payload) => axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, payload);
export const resetPasswordRequest = (token, payload) =>
  axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD(token), payload);
