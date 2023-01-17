import axios, { type AxiosRequestConfig } from 'axios';

const baseConfig: AxiosRequestConfig = {
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  ...baseConfig,
});

export const sanctum = axios.create({
  baseURL: `${
    (process.env.NEXT_PUBLIC_API_URL as string).split('api')[0] as string
  }sanctum/`,
  ...baseConfig,
});

export default api;
