import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";

export const getExpenseList = (params) => axiosInstance.get(API_PATHS.EXPENSE.BASE, { params });
export const addExpense = (payload) => axiosInstance.post(API_PATHS.EXPENSE.BASE, payload);
export const updateExpense = (id, payload) => axiosInstance.put(API_PATHS.EXPENSE.BY_ID(id), payload);
export const deleteExpense = (id) => axiosInstance.delete(API_PATHS.EXPENSE.BY_ID(id));
export const downloadExpense = () =>
  axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD, { responseType: "blob" });
