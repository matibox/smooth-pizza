import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const Admin: NextPage = () => {
  const { user, isLoading: userLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(userLoading, user);
    if (userLoading) return;
    if (user && user.isAdmin === '1') return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push('/');
  }, [user, router, userLoading]);

  return (
    <div className='min-h-screen w-full bg-orange-100 pt-[calc(var(--navbar-height)_+_1rem)]'>
      {userLoading && <Loading isLoading={userLoading} fullScreen />}
      <h1>Admin panel</h1>
    </div>
  );
};

export default Admin;
