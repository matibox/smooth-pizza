export type ProductCategory =
  | 'pizza'
  | 'sauce'
  | 'cold-drinks'
  | 'hot-drinks'
  | 'beer'
  | 'wine';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  created_at: string;
  updated_at: string;
  category: ProductCategory;
};

export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
