import axios from 'axios';
import { env } from '../env/client.mjs';

const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

export default api;
