export const API_PATHS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: (token) => `/auth/reset-password/${token}`,
  },
  INCOME: {
    BASE: "/income",
    BY_ID: (id) => `/income/${id}`,
    DOWNLOAD: "/income/download",
  },
  EXPENSE: {
    BASE: "/expense",
    BY_ID: (id) => `/expense/${id}`,
    DOWNLOAD: "/expense/download",
  },
  DASHBOARD: {
    BASE: "/dashboard",
    ANALYTICS: "/dashboard/analytics",
    INSIGHTS: "/dashboard/insights",
  },
  BUDGET: {
    BASE: "/budget",
    BY_ID: (id) => `/budget/${id}`,
  },
  GOALS: {
    BASE: "/goals",
    BY_ID: (id) => `/goals/${id}`,
  },
  PROFILE: {
    BASE: "/profile",
    PASSWORD: "/profile/password",
    AVATAR: "/profile/avatar",
  },
};
