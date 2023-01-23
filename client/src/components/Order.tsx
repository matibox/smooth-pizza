import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type FC } from 'react';
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
    <div className='relative w-full'>
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
      <div className='bg-stone-50'>
        {order.products.map(product => (
          <Product key={product.id} product={product} />
        ))}
      </div>
      <div className='flex justify-between bg-stone-200 py-2 px-4'>
        <>
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
  product: Omit<TProduct, 'slug' | 'created_at' | 'updated_at'>;
}> = ({ product }) => {
  return (
    <div className='flex items-center justify-between border-b border-orange-200 bg-stone-50 px-4 py-2 last:border-b-0'>
      <div className='flex flex-col justify-center'>
        <span className='text-amber-600'>{product.name}</span>
        <span className='text-sm'>{product.description}</span>
      </div>
      <span>{product.price} €</span>
    </div>
  );
};

export default Order;
