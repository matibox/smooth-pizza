import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type FC } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { signOut } from '../lib/auth';
import Cart from './Cart';

const noSignInBtnRoutes = ['/signin', '/signup', '/signedOut'];

const Navbar: FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setCartOpened, cartOpened } = useCart();

  const { mutate } = useMutation({
    mutationFn: (token: string) => signOut(token),
    onSuccess: async () => {
      await router.push('/signedOut');
    },
  });

  return (
    <div
      className={`fixed top-0 left-0 z-50 flex h-[var(--navbar-height)] w-screen items-center gap-2 border-b border-b-stone-200 bg-stone-50 bg-opacity-70 px-4 font-roboto-slab
    text-stone-900 backdrop-blur sm:px-8
      `}
    >
      <Link
        href='/'
        className='group flex items-center gap-2 focus-visible:outline-none'
      >
        <Image
          src='/logo.png'
          alt="Smooth pizza's logo"
          width={40}
          height={40}
        />
        <span
          className={`text-lg tracking-wide transition-colors group-hover:text-amber-600 group-focus-visible:text-amber-600`}
        >
          Smooth Pizza
        </span>
      </Link>
      {user && (
        <button
          onClick={() => setCartOpened(prev => !prev)}
          className={`ml-auto px-3 py-1 ring-1 ring-stone-900 transition-all ${
            cartOpened ? 'text-amber-600 ring-amber-600' : ''
          } hover:text-amber-500 hover:ring-amber-500 md:px-4`}
        >
          Cart
        </button>
      )}
      {!user && !noSignInBtnRoutes.includes(router.pathname) && (
        <Link
          href={'/signin'}
          className={`ml-auto px-3 py-1 ring-1 ring-stone-900 transition-all hover:text-amber-600 hover:ring-amber-600 focus-visible:text-amber-600 focus-visible:outline-none focus-visible:ring-amber-600 md:px-4`}
        >
          Sign in
        </Link>
      )}
      {user && router.pathname !== '/signedOut' && (
        <button
          onClick={() => mutate(user.token)}
          className='px-3 py-1 ring-1 ring-stone-900 transition-all hover:text-amber-600 hover:ring-amber-600 focus-visible:text-amber-600 focus-visible:outline-none focus-visible:ring-amber-600 md:px-4'
        >
          Sign out
        </button>
      )}
      {cartOpened && <Cart />}
    </div>
  );
};

export default Navbar;
