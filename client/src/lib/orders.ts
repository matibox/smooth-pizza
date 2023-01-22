import type { OrderPOSTInput, OrderPOSTReturn } from '../types/Order';
import api from '../utils/axios';

export async function placeOrder(
  order: OrderPOSTInput,
  token: string | undefined
) {
  return await api.post<OrderPOSTReturn>(
    'orders',
    {
      payment: order.payment,
      price: order.price,
      street: order.street,
      house_number: order.houseNumber,
      apartment_number: order.apartmentNumber,
      city: order.city,
      products: order.products,
    },
    {
      headers: {
        Authorization: `Bearer ${token ?? ''}`,
      },
    }
  );
}
