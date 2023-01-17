import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type FC } from 'react';
import { useAuth } from '../context/AuthContext';

const noSignInBtnRoutes = ['/signin', '/signup'];

const Navbar: FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div
      className={`fixed top-0 left-0 z-10 flex h-[var(--navbar-height)] w-screen items-center justify-between border-b border-b-stone-200 bg-stone-50 bg-opacity-70 px-4 font-roboto-slab
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
      {(!noSignInBtnRoutes.includes(router.pathname) || user) && (
        <Link
          href={'/signin'}
          className={`px-4 py-1 ring-1 ring-stone-900 transition-all hover:text-amber-600 hover:ring-amber-600 focus-visible:text-amber-600 focus-visible:outline-none focus-visible:ring-amber-600`}
        >
          Sign in
        </Link>
      )}
    </div>
  );
};

export default Navbar;
