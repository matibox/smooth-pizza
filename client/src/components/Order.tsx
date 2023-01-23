import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, type FC } from 'react';
import { useAuth } from '../context/AuthContext';
import { completeOrder } from '../lib/orders';
import { isApiError } from '../types/Error';
import type { Order as TOrder } from '../types/Order';
import type { Product as TProduct } from '../types/Product';
import formatDate from '../utils/formatDate';
import formatError from '../utils/formatError';
import Loading from './Loading';

type OrderProps = {
  order: TOrder;
};

const Order: FC<OrderProps> = ({ order }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isLoading, error } = useMutation({
    mutationFn: (data: { orderId: number; token: string | undefined }) => {
      const { orderId, token } = data;
      return completeOrder(orderId, token);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return (
    <div className='relative w-full bg-stone-50'>
      {isLoading && (
        <div className='absolute top-0 left-0 flex h-full w-full items-center justify-center bg-stone-900/40'>
          <Loading isLoading={isLoading} />
        </div>
      )}
      <div className='flex items-center justify-between gap-4 bg-stone-200 py-1 px-4 text-stone-900'>
        <span className='text-sm sm:text-base'>
          {formatDate(new Date(order.createdAt))}
        </span>
        <span className='text-xs sm:text-sm'>{order.user.email}</span>
      </div>
      <h3 className='px-4 pt-1 text-lg'>Products:</h3>
      <div>
        {order.products.map(product => (
          <Product key={product.id} product={product} />
        ))}
      </div>
      <h3 className='mt-2 mb-0.5 px-4 text-lg'>Delivery:</h3>
      <div className='grid w-full grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-1 px-4 text-sm'>
        <div>
          <span className='font-bold'>City:</span> {order.city}
        </div>
        <div>
          <span className='font-bold'>House number:</span> {order.house_number}
        </div>
        <div>
          <span className='font-bold'>Street:</span> {order.street}
        </div>
        <div>
          <span className='font-bold'>Apartment number:</span>{' '}
          {order.apartment_number ?? '-'}
        </div>
      </div>
      <h3 className='mt-2 mb-0.5 px-4 text-lg'>Payment:</h3>
      <div className='mb-4 px-4 text-sm'>
        <div>
          <span className='font-bold'>Type: </span> {order.payment}
        </div>
      </div>
      <div className='flex items-center justify-between bg-stone-200 py-2 px-4'>
        <>
          <span className='font-bold'>
            Total price: {parseFloat(order.price).toFixed(2)} €
          </span>
          {error && (
            <p>{isApiError(error) ? formatError(error) : 'Unknown Error.'}</p>
          )}
          <button
            className='ml-auto px-2 py-1 ring-1 ring-stone-900 transition-all hover:text-amber-600 hover:ring-amber-600 focus:text-amber-600 focus:outline-none focus:ring-amber-600'
            onClick={() => mutate({ orderId: order.id, token: user?.token })}
            disabled={isLoading}
          >
            Complete order
          </button>
        </>
      </div>
    </div>
  );
};

const Product: FC<{
  product: Omit<TProduct, 'slug' | 'created_at' | 'updated_at'> & {
    amount: string;
  };
}> = ({ product }) => {
  const productPrice = useMemo(() => {
    return (parseInt(product.amount) * parseFloat(product.price)).toFixed(2);
  }, [product.price, product.amount]);

  return (
    <div className='flex items-center justify-between border-b border-orange-200 bg-stone-50 px-4 py-2 first:pt-0 last:border-b-0'>
      <div className='flex flex-col justify-center'>
        <span className='text-amber-600'>
          {product.name} x {product.amount}
        </span>
        <span className='text-sm'>{product.description}</span>
      </div>
      <span>{productPrice} €</span>
    </div>
  );
};

export default Order;
