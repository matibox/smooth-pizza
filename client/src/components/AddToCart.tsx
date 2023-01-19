import Link from 'next/link';
import {
  type Dispatch,
  type SetStateAction,
  type FC,
  useState,
  useMemo,
} from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { Product } from '../types/Product';
import ProductEl from './Product';

type AddToCartProps = {
  product: Product;
  setProduct: Dispatch<SetStateAction<Product | undefined>>;
};

const AddToCart: FC<AddToCartProps> = ({ product, setProduct }) => {
  const { user } = useAuth();
  const [count, setCount] = useState(1);
  const { addProduct } = useCart();

  const totalPrice = useMemo(() => {
    return (parseFloat(product.price) * count).toFixed(2);
  }, [count, product.price]);

  return (
    <>
      <div
        className='fixed top-0 left-0 z-30 h-screen w-full bg-stone-900/50 backdrop-blur'
        onClick={() => setProduct(undefined)}
      />
      <div className='fixed top-1/2 left-1/2 z-50 flex w-11/12 max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col justify-between bg-orange-100 p-6 font-roboto-slab ring-2 ring-stone-50'>
        <button
          className='absolute top-1 right-2'
          onClick={() => setProduct(undefined)}
        >
          X
        </button>
        {user ? (
          <>
            <h2 className='w-full text-center text-2xl text-stone-900'>
              Add to cart
            </h2>
            <div className='flex w-full items-center justify-between'>
              <div>
                <ProductEl product={product} addToCart={false} />
              </div>
              <div className='flex w-32 justify-between bg-amber-500 py-2 px-4 ring-1 ring-stone-50'>
                <button
                  onClick={() =>
                    setCount(prev => {
                      if (prev === 1) return prev;
                      return prev - 1;
                    })
                  }
                >
                  -
                </button>
                <span className='font-bold'>{count}</span>
                <button onClick={() => setCount(prev => prev + 1)}>+</button>
              </div>
            </div>
            <div className='flex w-full items-center justify-between self-end sm:w-max sm:gap-8'>
              <span className='text-lg font-bold'>Total: {totalPrice} €</span>
              <button
                className='w-32 px-4 py-1 ring-1 ring-stone-900 transition-all hover:text-amber-600 hover:ring-amber-600 focus-visible:text-amber-600 focus-visible:outline-none focus-visible:ring-amber-600'
                onClick={() => {
                  addProduct(product, count);
                  setProduct(undefined);
                }}
              >
                Add to cart
              </button>
            </div>
          </>
        ) : (
          <span>
            Please{' '}
            <Link
              href='/signin'
              className='text-amber-600 hover:text-amber-500'
            >
              sign in
            </Link>{' '}
            to order online.
          </span>
        )}
      </div>
    </>
  );
};

export default AddToCart;
