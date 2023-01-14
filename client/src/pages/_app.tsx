import { type AppType } from 'next/dist/shared/lib/utils';
import Navbar from '../components/Navbar';
import { Roboto_Slab } from '@next/font/google';

import '../styles/globals.css';

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  display: 'swap',
  variable: '--roboto-slab',
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <nav className={robotoSlab.variable}>
        <Navbar />
      </nav>
      <main
        className={`${robotoSlab.variable} min-h-[calc(100vh_-_var(--navbar-height))] w-full overflow-x-hidden`}
      >
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default MyApp;
