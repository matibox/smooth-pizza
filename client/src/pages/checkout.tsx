import { type NextPage } from 'next';
import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

const Checkout: NextPage = () => {
  const { setCartOpened } = useCart();

  useEffect(() => {
    setCartOpened(false);
  }, [setCartOpened]);

  return (
    <div className='relative h-screen w-full bg-orange-100 pt-[calc(var(--navbar-height)_+_1rem)] font-roboto-slab'>
      <h1>Checkout</h1>
    </div>
  );
};

export default Checkout;
