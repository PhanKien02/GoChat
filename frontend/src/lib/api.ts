"use client";
import axios from "axios";
import { getCookie } from "./cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TIMEOUT = 10000;
const baseRequest = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT, // Thời gian chờ (ms)

  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

baseRequest.interceptors.request.use(
  async (config) => {
    const token = getCookie("accessToken");
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error || "Có lỗi hệ thống vui lòng thử lại"),
);
baseRequest.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!error.response) {
      return Promise.reject(error.response?.data || "Something went wrong");
    }
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      return baseRequest(originalRequest);
    }
    return Promise.reject(error.response?.data || "Something went wrong");
  },
);

export default baseRequest;
