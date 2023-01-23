import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { RadioGroup } from '@headlessui/react';
import type { PaymentMethod } from '../types/Payment';
import { z } from 'zod';
import { parseSchema } from '../utils/zod';
import { useMutation } from '@tanstack/react-query';
import { placeOrder } from '../lib/orders';
import type { OrderPOSTInput } from '../types/Order';
import Loading from '../components/Loading';
import formatError from '../utils/formatError';
import { isApiError } from '../types/Error';

const promoCode = process.env.NEXT_PUBLIC_PROMO_CODE as string;

const paymentMethods: readonly PaymentMethod[] = [
  'BLIK',
  'Transfer',
  'Visa/Mastercard',
] as const;

const formSchema = z.object({
  delivery: z.object({
    street: z.string().min(1, 'Street is required'),
    houseNumber: z.string().min(1, 'House number is required'),
    city: z.string().min(1, 'City is required'),
    apartmentNumber: z.string().optional(),
  }),
  cart: z.array(z.any()).min(1, 'Your cart is empty'),
  payment: z.enum(['BLIK', 'Transfer', 'Visa/Mastercard']),
});

const Checkout: NextPage = () => {
  const {
    setCartOpened,
    products,
    totalPrice: itemsPrice,
    removeProduct,
  } = useCart();
  const { user, isLoading: userLoading } = useAuth();
  const router = useRouter();

  const [formState, setFormState] = useState({
    payment: paymentMethods[0] as PaymentMethod,
    promoCode: '',
    street: '',
    houseNumber: '',
    city: '',
    apartmentNumber: '',
  });

  const [formError, setFormError] = useState<string>();

  useEffect(() => {
    setCartOpened(false);
  }, [setCartOpened]);

  useEffect(() => {
    if (userLoading) return;
    if (user) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push('/');
  }, [user, router, userLoading]);

  const totalPrice = useMemo(() => {
    if (formState.promoCode === promoCode) {
      return parseFloat((itemsPrice * 0.9).toFixed(2));
    }
    return itemsPrice;
  }, [formState.promoCode, itemsPrice]);

  const { mutate, isLoading, error } = useMutation({
    mutationFn: (data: {
      order: OrderPOSTInput;
      token: string | undefined;
    }) => {
      const { order, token } = data;
      return placeOrder(order, token);
    },
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/');
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const { street, houseNumber, city, apartmentNumber, payment } = formState;

    const formData = {
      delivery: {
        street,
        houseNumber,
        city,
        apartmentNumber,
      },
      cart: products,
      payment,
    };

    const result = parseSchema(formSchema, formData);

    if (result.error) {
      return setFormError(result.message);
    }

    mutate({
      order: {
        ...formState,
        houseNumber: parseInt(formState.houseNumber),
        apartmentNumber: parseInt(formState.apartmentNumber),
        price: totalPrice,
        products,
      },
      token: user?.token,
    });
  }

  return (
    <div className='min-h-screen w-full bg-orange-100 pt-[calc(var(--navbar-height)_+_1rem)] pb-4 font-roboto-slab'>
      {isLoading && <Loading isLoading={isLoading} fullScreen />}
      <form
        className='mx-auto flex w-4/5 max-w-xl flex-col gap-6 bg-stone-50 p-4'
        onSubmit={handleSubmit}
      >
        <section className='flex w-full flex-col gap-4'>
          <h1 className='text-center text-xl md:text-3xl'>Checkout</h1>
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
                {products.length !== 1 && (
                  <button
                    className='text-amber-600 transition-colors hover:text-amber-400'
                    onClick={() => removeProduct(product.id)}
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className='flex w-full justify-between'>
            <label className='flex w-44 flex-col gap-1'>
              <span className='w-full text-right md:text-left'>Promo code</span>
              <input
                className='py-0.5 px-2 ring-1 ring-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600'
                type='text'
                value={formState.promoCode}
                onChange={e =>
                  setFormState(prev => ({ ...prev, promoCode: e.target.value }))
                }
              />
            </label>
            <span className='self-end font-bold md:text-lg'>
              Total price: €
              {totalPrice === itemsPrice ? (
                totalPrice
              ) : (
                <>
                  <span className='mr-2'>{totalPrice} €</span>
                  <span className='text-sm font-normal line-through'>
                    {itemsPrice}
                  </span>
                </>
              )}
            </span>
          </div>
        </section>
        <section className='flex w-full flex-col gap-4'>
          <h2 className='text-lg md:text-xl'>Delivery</h2>
          <div className='flex flex-wrap justify-between gap-2'>
            <label className='flex w-full flex-col gap-1 md:w-[calc(50%_-_0.5rem)]'>
              <span>Street</span>
              <input
                type='text'
                className='py-0.5 px-2 ring-1 ring-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600'
                value={formState.street}
                onChange={e =>
                  setFormState(prev => ({ ...prev, street: e.target.value }))
                }
              />
            </label>
            <label className='flex w-full flex-col gap-1 md:w-[calc(50%_-_0.5rem)]'>
              <span>House number</span>
              <input
                type='number'
                className='py-0.5 px-2 ring-1 ring-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600'
                value={formState.houseNumber}
                onChange={e =>
                  setFormState(prev => ({
                    ...prev,
                    houseNumber: e.target.value,
                  }))
                }
              />
            </label>
            <label className='flex w-full flex-col gap-1 md:w-[calc(50%_-_0.5rem)]'>
              <span>City</span>
              <input
                type='text'
                className='py-0.5 px-2 ring-1 ring-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600'
                value={formState.city}
                onChange={e =>
                  setFormState(prev => ({ ...prev, city: e.target.value }))
                }
              />
            </label>
            <label className='flex w-full flex-col gap-1 md:w-[calc(50%_-_0.5rem)]'>
              <span>Apartment number</span>
              <input
                type='number'
                className='py-0.5 px-2 ring-1 ring-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600'
                value={formState.apartmentNumber}
                onChange={e =>
                  setFormState(prev => ({
                    ...prev,
                    apartmentNumber: e.target.value,
                  }))
                }
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
          <>
            <RadioGroup
              value={formState.payment}
              onChange={value =>
                setFormState(prev => ({ ...prev, payment: value }))
              }
            >
              <RadioGroup.Label as='h2' className='mb-4 text-lg md:text-xl'>
                Payment
              </RadioGroup.Label>
              <div className='flex flex-col gap-2 md:flex-row'>
                {paymentMethods.map(method => (
                  <RadioGroup.Option key={method} value={method}>
                    {({ checked }) => (
                      <span
                        className={`${
                          checked
                            ? 'bg-amber-500 ring-amber-500'
                            : 'bg-stone-50 ring-stone-900 hover:text-amber-500 hover:ring-amber-500'
                        } flex w-full cursor-pointer items-center justify-center px-6 py-2 text-stone-900 ring-1   transition-all sm:w-40`}
                      >
                        {method}
                      </span>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
            {formError && <p className='text-red-600'>{formError}</p>}
            {error && (
              <p className='text-red-600'>
                {isApiError(error)
                  ? formatError(error)
                  : 'Unknown error occured.'}
              </p>
            )}
          </>
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
