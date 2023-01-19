import {
  createContext,
  useState,
  type ReactNode,
  useMemo,
  useContext,
} from 'react';
import type { Product } from '../types/Product';

type CartContext = {
  products: Array<Product & { amount: number }>;
  addProduct: (product: Product, amount: number) => void;
  removeProduct: (id: number) => void;
  totalPrice: number;
};

const CartContext = createContext<CartContext | undefined>(undefined);

export function useCart() {
  const cartContext = useContext(CartContext);
  if (!cartContext) {
    throw new Error('Context consumer must be in a context provider');
  }
  return cartContext;
}

export default function CartContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cartProducts, setCartProducts] = useState<
    Array<Product & { amount: number }>
  >([]);

  const addProduct = (product: Product, amount: number) => {
    setCartProducts(prev => [
      ...prev,
      {
        ...product,
        amount,
      },
    ]);
  };

  const removeProduct = (id: number) => {
    setCartProducts(prev => prev.filter(product => product.id !== id));
  };

  const totalPrice = useMemo(() => {
    let totalPrice = 0;
    cartProducts.forEach(product => {
      totalPrice += parseFloat(product.price) * product.amount;
    });
    return totalPrice;
  }, [cartProducts]);

  return (
    <CartContext.Provider
      value={{ products: cartProducts, addProduct, removeProduct, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}
