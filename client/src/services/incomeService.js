import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";

export const getIncomeList = (params) => axiosInstance.get(API_PATHS.INCOME.BASE, { params });
export const addIncome = (payload) => axiosInstance.post(API_PATHS.INCOME.BASE, payload);
export const updateIncome = (id, payload) => axiosInstance.put(API_PATHS.INCOME.BY_ID(id), payload);
export const deleteIncome = (id) => axiosInstance.delete(API_PATHS.INCOME.BY_ID(id));
export const downloadIncome = () =>
  axiosInstance.get(API_PATHS.INCOME.DOWNLOAD, { responseType: "blob" });
