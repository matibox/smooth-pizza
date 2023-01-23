import type { Product, ProductInput } from '../types/Product';
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

export async function addProduct(
  product: ProductInput,
  token: string | undefined
) {
  return await api
    .post<Product>('products', product, {
      headers: {
        Authorization: `Bearer ${token ?? ''}`,
      },
    })
    .then(res => res.data);
}
