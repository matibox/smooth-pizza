import type { PaymentMethod } from './Payment';
import type { Product } from './Product';
import type { User } from './User';

export type OrderReturn = {
  id: number;
  payment: string;
  price: string;
  user_id: number;
  street: string;
  house_number: number;
  city: string;
  apartment_number: null | number;
  updatedAt: string;
  createdAt: string;
};

export type OrderPOSTInput = {
  payment: PaymentMethod;
  price: number;
  street: string;
  houseNumber: number;
  apartmentNumber?: number;
  city: string;
  products: Array<Product & { amount: number }>;
};

export type GetOrdersReturn = {
  data: Array<Order>;
};

export type Order = Omit<OrderReturn, 'user_id'> & {
  user: Omit<User, 'isAdmin'>;
} & {
  products: Array<
    Omit<Product, 'slug' | 'created_at' | 'updated_at'> & { amount: string }
  >;
};
