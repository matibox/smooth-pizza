import { type NextPage } from 'next';
import Link from 'next/link';

const SignedOut: NextPage = () => {
  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center gap-2 bg-orange-100 font-roboto-slab'>
      <h1 className='text-2xl'>Successfully signed out.</h1>
      <Link
        href='/'
        className='text-amber-600 transition-colors hover:text-amber-400'
      >
        &lt; go back to home page
      </Link>
    </div>
  );
};

export default SignedOut;
