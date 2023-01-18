import { useMutation } from '@tanstack/react-query';
import { type NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, type FormEvent } from 'react';
import { z } from 'zod';
import Loading from '../components/Loading';
import UserForm, { type FormState, type Field } from '../components/UserForm';
import { useAuth } from '../context/AuthContext';
import useSignInProtection from '../hooks/useSignInProtection';
import { signIn } from '../lib/auth';
import { isApiError } from '../types/Error';
import formatError from '../utils/formatError';
import { parseSchema } from '../utils/zod';

const formFields: Field[] = [
  {
    label: 'email',
    type: 'email',
  },
  {
    label: 'password',
    type: 'password',
  },
];

const signInSchema = z.object({
  email: z.string().min(1, {
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});

const SignIn: NextPage = () => {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
  });

  const [validationError, setValidationError] = useState<string>();

  const router = useRouter();
  const { user, setUser, setToken } = useAuth();

  const { mutate, isLoading, error } = useMutation({
    mutationFn: (userData: z.infer<typeof signInSchema>) => signIn(userData),
    onSuccess: data => {
      setUser(data.user);
      setToken(data.token);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/');
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const userData = {
      password: formState.password as string,
      email: formState.email as string,
    };

    const parseResult = parseSchema(signInSchema, userData);
    if (parseResult.error) {
      setValidationError(parseResult.message);
      return;
    }

    mutate(userData);
  }

  useSignInProtection(router, user);

  return (
    <div className='flex h-screen w-screen flex-col justify-center gap-4 bg-orange-100 pt-[var(--navbar-height)] font-roboto-slab'>
      <Loading isLoading={isLoading} fullScreen />
      <div className='mx-auto flex w-3/4 max-w-lg flex-col gap-2'>
        <h1 className='text-4xl'>Sign in</h1>
        <p>
          Don&apos;t have an account?{' '}
          <Link
            href='/signup'
            className='text-amber-600 transition-colors hover:text-amber-400 focus:outline-none focus-visible:text-amber-400'
          >
            Sign up.
          </Link>
        </p>
      </div>
      <UserForm
        formState={formState}
        setFormState={setFormState}
        handleSubmit={handleSubmit}
        fields={formFields}
        submitBtnText='Sign in'
      />
      <>
        {error && (
          <p className='mx-auto w-3/4 max-w-lg text-red-600'>
            {isApiError(error) ? formatError(error) : 'Unknown error occured'}
          </p>
        )}
        {validationError && (
          <p className='mx-auto w-3/4 max-w-lg text-red-600'>
            {validationError}
          </p>
        )}
      </>
    </div>
  );
};

export default SignIn;
