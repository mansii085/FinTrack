import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";

// Budget
export const getBudgets = (month) => axiosInstance.get(API_PATHS.BUDGET.BASE, { params: { month } });
export const saveBudget = (payload) => axiosInstance.post(API_PATHS.BUDGET.BASE, payload);
export const deleteBudget = (id) => axiosInstance.delete(API_PATHS.BUDGET.BY_ID(id));

// Savings goals
export const getGoals = () => axiosInstance.get(API_PATHS.GOALS.BASE);
export const createGoal = (payload) => axiosInstance.post(API_PATHS.GOALS.BASE, payload);
export const updateGoal = (id, payload) => axiosInstance.put(API_PATHS.GOALS.BY_ID(id), payload);
export const deleteGoal = (id) => axiosInstance.delete(API_PATHS.GOALS.BY_ID(id));

// Profile
export const updateProfile = (payload) => axiosInstance.put(API_PATHS.PROFILE.BASE, payload);
export const changePassword = (payload) => axiosInstance.put(API_PATHS.PROFILE.PASSWORD, payload);
export const updateAvatar = (formData) =>
  axiosInstance.put(API_PATHS.PROFILE.AVATAR, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
