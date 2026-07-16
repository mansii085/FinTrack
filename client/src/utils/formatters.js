import { CURRENCY_SYMBOLS } from "../constants/categories";

export const formatCurrency = (amount = 0, currency = "INR") => {
  const symbol = CURRENCY_SYMBOLS[currency] || "₹";
  const value = Number(amount) || 0;
  return `${symbol}${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateShort = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

export const toInputDate = (date) => {
  const d = date ? new Date(date) : new Date();
  return d.toISOString().slice(0, 10);
};
