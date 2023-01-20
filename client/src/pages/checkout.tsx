import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { RadioGroup } from '@headlessui/react';
import type { Payment } from '../types/Payment';

const paymentMethods: Payment[] = [
  {
    id: 0,
    method: 'BLIK',
  },
  {
    id: 1,
    method: 'Transfer',
  },
  {
    id: 2,
    method: 'Visa/Mastercard',
  },
];

const Checkout: NextPage = () => {
  const { setCartOpened, products, totalPrice, removeProduct } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [formState, setFormState] = useState({
    payment: paymentMethods[0],
  });

  useEffect(() => {
    setCartOpened(false);
  }, [setCartOpened]);

  useEffect(() => {
    if (user) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push('/');
  }, [user, router]);

  return (
    <div className='min-h-screen w-full bg-orange-100 pt-[calc(var(--navbar-height)_+_1rem)] pb-4 font-roboto-slab'>
      <form className='mx-auto flex w-4/5 max-w-xl flex-col gap-6 bg-stone-50 p-4'>
        <section className='flex w-full flex-col gap-4'>
          <h1 className='text-xl md:text-3xl'>Checkout</h1>
          <h2 className='text-lg md:text-xl'>Cart</h2>
          <div>
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
          <span className='self-end font-bold md:text-lg'>
            Total price: {totalPrice} €
          </span>
        </section>
        <section className='flex w-full flex-col gap-4'>
          <h2 className='text-lg md:text-xl'>Delivery</h2>
          <div className='flex flex-wrap justify-between gap-2'>
            <label className='flex w-full flex-col gap-1 md:w-[calc(50%_-_0.5rem)]'>
              <span>Street</span>
              <input
                type='text'
                className='py-0.5 px-2 ring-1 ring-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600'
              />
            </label>
            <label className='flex w-full flex-col gap-1 md:w-[calc(50%_-_0.5rem)]'>
              <span>House number</span>
              <input
                type='number'
                className='py-0.5 px-2 ring-1 ring-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600'
              />
            </label>
            <label className='flex w-full flex-col gap-1 md:w-[calc(50%_-_0.5rem)]'>
              <span>City</span>
              <input
                type='text'
                className='py-0.5 px-2 ring-1 ring-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600'
              />
            </label>
            <label className='flex w-full flex-col gap-1 md:w-[calc(50%_-_0.5rem)]'>
              <span>Apartment number</span>
              <input
                type='number'
                className='py-0.5 px-2 ring-1 ring-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600'
              />
            </label>
          </div>
        </section>
        <section className='flex w-full flex-col gap-4'>
          <h2 className='text-lg md:text-xl'>Contact details</h2>
          <div className='flex flex-col'>
            <span>
              <span className='font-bold'>Name:</span> {user?.name}
            </span>
            <span>
              <span className='font-bold'>Email:</span> {user?.email}
            </span>
          </div>
        </section>
        <section className='flex w-full flex-col gap-4'>
          <RadioGroup
            value={formState.payment}
            onChange={value =>
              setFormState(prev => ({ ...prev, payment: value }))
            }
          >
            <RadioGroup.Label as='h2' className='mb-4 text-lg md:text-xl'>
              Payment
            </RadioGroup.Label>
            <div className='flex flex-col gap-2'>
              {paymentMethods.map(paymentMethod => (
                <RadioGroup.Option
                  key={paymentMethod.id}
                  value={paymentMethod.method}
                >
                  {({ checked }) => (
                    <span
                      className={`${
                        checked
                          ? 'bg-amber-500 ring-amber-500'
                          : 'bg-stone-50 ring-stone-900'
                      } flex w-full cursor-pointer items-center justify-center px-6 py-2 text-stone-900 ring-1  sm:w-40`}
                    >
                      {paymentMethod.method}
                    </span>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </section>
        <section className='flex w-full flex-col border-t border-stone-300 pt-6'>
          <button
            type='submit'
            className='px-3 py-1 ring-1 ring-stone-900 transition-all hover:text-amber-600 hover:ring-amber-600 focus-visible:text-amber-600 focus-visible:outline-none focus-visible:ring-amber-600 md:px-4'
          >
            Order
          </button>
        </section>
      </form>
    </div>
  );
};

export default Checkout;
