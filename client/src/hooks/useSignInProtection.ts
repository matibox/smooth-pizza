import { type NextRouter } from 'next/router';
import { useEffect } from 'react';
import { type User } from '../types/User';

export default function useSignInProtection(
  router: NextRouter,
  user: Partial<
    | (User & {
        token: string;
      })
    | undefined
  >
) {
  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push('/');
  }, [router, user]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.prefetch('/');
  }, [router]);
}
