import type {
  GetOrdersReturn,
  OrderPOSTInput,
  OrderReturn,
} from '../types/Order';
import api from '../utils/axios';

export async function placeOrder(
  order: OrderPOSTInput,
  token: string | undefined
) {
  return await api.post<OrderReturn>(
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

export async function getOrders(token: string | undefined) {
  return await api
    .get<GetOrdersReturn>('orders', {
      headers: {
        Authorization: `Bearer ${token ?? ''}`,
      },
    })
    .then(res => res.data);
}
