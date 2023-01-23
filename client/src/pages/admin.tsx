import { useQuery } from '@tanstack/react-query';
import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Loading from '../components/Loading';
import Order from '../components/Order';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../lib/orders';
import { isApiError } from '../types/Error';
import formatError from '../utils/formatError';

const Admin: NextPage = () => {
  const { user, isLoading: userLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userLoading) return;
    if (user && user.isAdmin === '1') return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push('/');
  }, [user, router, userLoading]);

  const { data: orders, ...ordersQuery } = useQuery({
    queryKey: ['orders'],
    queryFn: () => {
      return getOrders(user?.token);
    },
    enabled: user?.token ? true : false,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });

  return (
    <div className='min-h-screen w-full bg-orange-100 pt-[var(--navbar-height)] font-roboto-slab'>
      {userLoading && <Loading isLoading={userLoading} fullScreen />}
      <div className='grid min-h-full w-full grid-cols-1 p-4 md:grid-cols-[repeat(2,_1fr)] xl:grid-cols-[2fr,_3fr]'>
        <section>
          <h1 className='mb-4 text-center text-3xl text-stone-900'>Orders</h1>
          <div className='flex flex-col gap-4'>
            <>
              {ordersQuery.error && (
                <p className='text-center text-red-500'>
                  {isApiError(ordersQuery.error)
                    ? formatError(ordersQuery.error)
                    : 'Unknown error.'}
                </p>
              )}
              {orders?.data && orders.data.length > 0 ? (
                orders.data.map(order => <Order key={order.id} order={order} />)
              ) : (
                <p className='text-center text-lg'>There are no orders</p>
              )}
              {ordersQuery.isLoading && (
                <Loading isLoading={ordersQuery.isLoading} />
              )}
            </>
          </div>
        </section>
        <section>Products</section>
      </div>
    </div>
  );
};

export default Admin;
