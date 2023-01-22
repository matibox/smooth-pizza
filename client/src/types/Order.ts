import type { PaymentMethod } from './Payment';
import type { Product } from './Product';

export type OrderPOSTReturn = {
  id: number;
  payment: string;
  price: number;
  user_id: number;
  street: string;
  house_number: number;
  city: string;
  apartment_number: null | number;
  updated_at: string;
  created_at: string;
};

export type OrderPOSTInput = {
  payment: PaymentMethod;
  price: number;
  street: string;
  houseNumber: number;
  apartmentNumber?: number;
  city: string;
  products: Product[];
};
