import Link from 'next/link';
import { type FC } from 'react';
import { useCart } from '../context/CartContext';

const Cart: FC = () => {
  const { products, removeProduct, clearCart, totalPrice } = useCart();

  return (
    <div className='absolute right-4 top-[calc(var(--navbar-height)_+_1rem)] mx-auto flex w-[calc(100%_-_2rem)] flex-col items-center justify-center bg-orange-100 p-2 ring-1 ring-stone-900 drop-shadow-xl sm:right-16 sm:mx-0 sm:w-64'>
      <h2 className='text-2xl'>Cart</h2>
      {products.length > 0 ? (
        <>
          <div className='w-full'>
            {products.map(product => (
              <div key={product.id} className='flex w-full gap-3'>
                <span>
                  {product.name} x {product.amount}
                </span>
                <span className='ml-auto'>
                  {(parseFloat(product.price) * product.amount).toFixed(2)} €
                </span>
                <button
                  className='text-amber-600 transition-colors hover:text-amber-400'
                  onClick={() => removeProduct(product.id)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <div className='mt-2 w-full text-right'>
            <span className='font-bold'>Total price: {totalPrice} €</span>
          </div>
          <div className='mt-4 flex w-full items-center justify-around'>
            <Link
              href='/checkout'
              className='px-3 py-1 ring-1 ring-stone-900 transition-all hover:text-amber-600 hover:ring-amber-600 focus-visible:text-amber-600 focus-visible:outline-none focus-visible:ring-amber-600 md:px-4'
            >
              Checkout
            </Link>
            <button
              className='px-3 py-1 ring-1 ring-stone-900 transition-all hover:text-amber-600 hover:ring-amber-600 focus-visible:text-amber-600 focus-visible:outline-none focus-visible:ring-amber-600 md:px-4'
              onClick={clearCart}
            >
              Clear cart
            </button>
          </div>
        </>
      ) : (
        <p className='mt-2'>The cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
