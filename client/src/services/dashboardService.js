import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";

export const getDashboardData = () => axiosInstance.get(API_PATHS.DASHBOARD.BASE);
export const getAnalytics = (range = 30) =>
  axiosInstance.get(API_PATHS.DASHBOARD.ANALYTICS, { params: { range } });
export const getInsights = () => axiosInstance.get(API_PATHS.DASHBOARD.INSIGHTS);
