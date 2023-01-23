import { useQuery } from '@tanstack/react-query';
import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Loading from '../components/Loading';
import Order from '../components/Order';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../lib/orders';

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
    <div className='min-h-screen w-full bg-orange-100 pt-[var(--navbar-height)]'>
      {userLoading && <Loading isLoading={userLoading} fullScreen />}
      <div className='grid h-[calc(100vh_-_var(--navbar-height))] w-full grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] p-4'>
        <section>
          <h1 className='mb-2 text-center text-3xl text-stone-900'>Orders</h1>
          <div className='flex flex-col'>
            {orders?.data.map(order => (
              <Order key={order.id} order={order} />
            ))}
            {ordersQuery.isLoading && (
              <Loading isLoading={ordersQuery.isLoading} />
            )}
          </div>
        </section>
        <section>Products</section>
      </div>
    </div>
  );
};

export default Admin;
