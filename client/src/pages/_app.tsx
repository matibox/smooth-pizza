import { type AppType } from 'next/dist/shared/lib/utils';
import Navbar from '../components/Navbar';
import { Roboto_Slab } from '@next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import '../styles/globals.css';
import AuthContextProvider from '../context/AuthContext';

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  display: 'swap',
  variable: '--roboto-slab',
});

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <nav className={robotoSlab.variable}>
          <Navbar />
        </nav>
        <main
          className={`${robotoSlab.variable} min-h-[calc(100vh_-_var(--navbar-height))] w-full overflow-x-hidden`}
        >
          <Component {...pageProps} />
        </main>
      </AuthContextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default MyApp;
