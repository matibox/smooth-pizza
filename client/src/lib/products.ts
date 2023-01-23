import type { Product } from '../types/Product';
import api from '../utils/axios';

export async function getProducts() {
  return await api.get('products').then(res => res.data as Product[]);
}

export async function deleteProduct(
  productId: number,
  token: string | undefined
) {
  return await api.delete(`products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token ?? ''}`,
    },
  });
}
