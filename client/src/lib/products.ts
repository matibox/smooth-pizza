import type { Product } from '../types/Product';
import api from '../utils/axios';

export async function getProducts() {
  return await api.get('products').then(res => res.data as Product[]);
}
