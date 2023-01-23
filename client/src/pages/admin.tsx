import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
  type NextPage,
} from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import NewProductForm from '../components/NewProductForm';
import Order from '../components/Order';
import ProductEl from '../components/Product';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../lib/orders';
import { getProducts, deleteProduct as deleteProductFn } from '../lib/products';
import { isApiError } from '../types/Error';
import type { Product } from '../types/Product';
import formatError from '../utils/formatError';

const Admin: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ products: initialProducts }) => {
  const { user, isLoading: userLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [newProductIsOpen, setNewProductIsOpen] = useState(false);

  useEffect(() => {
    if (userLoading) return;
    if (user && user.isAdmin === '1') return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push('/');
  }, [user, router, userLoading]);

  const { data: orders, ...ordersQuery } = useQuery({
    queryKey: ['orders'],
    queryFn: () => getOrders(user?.token),
    enabled: user?.token ? true : false,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });

  const { data: products, ...productsQuery } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    initialData: initialProducts,
  });

  const { mutate: deleteProduct, ...deleteMutation } = useMutation({
    mutationFn: (data: { productId: number; token: string | undefined }) => {
      const { productId, token } = data;
      return deleteProductFn(productId, token);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['products']);
    },
  });

  function handleDelete(productId: number) {
    deleteProduct({ productId, token: user?.token });
  }

  return (
    <div className='min-h-screen w-full bg-orange-100 pt-[var(--navbar-height)] font-roboto-slab'>
      {userLoading && <Loading isLoading={userLoading} fullScreen />}
      {newProductIsOpen && (
        <NewProductForm close={() => setNewProductIsOpen(false)} />
      )}
      <div className='grid min-h-full w-full grid-cols-1 gap-8 p-4 md:grid-cols-[repeat(2,_1fr)] xl:grid-cols-[2fr,_3fr]'>
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
        <section>
          <h1 className='mb-4 text-center text-3xl'>Products</h1>
          <div className='relative flex flex-col'>
            <>
              {deleteMutation.isLoading && (
                <div className='absolute top-0 left-0 flex h-full w-full items-center justify-center bg-stone-900/50'>
                  <Loading isLoading={deleteMutation.isLoading} />
                </div>
              )}
              <button
                className='self-start text-stone-900 underline underline-offset-4 transition-colors hover:text-amber-600'
                onClick={() => setNewProductIsOpen(true)}
              >
                Add new product
              </button>
              {productsQuery.error && (
                <p className='text-center text-red-500'>
                  {isApiError(productsQuery.error)
                    ? formatError(productsQuery.error)
                    : 'Unknown error.'}
                </p>
              )}
              {products.length > 0 ? (
                products.map(product => (
                  <ProductEl
                    key={product.id}
                    addToCart={false}
                    product={product}
                    delete={true}
                    handleDelete={handleDelete}
                  />
                ))
              ) : (
                <p className='text-center text-lg'>There are no products</p>
              )}
            </>
          </div>
        </section>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  products: Product[];
}> = async () => {
  const data = await getProducts();

  return {
    props: {
      products: data,
    },
  };
};

export default Admin;
