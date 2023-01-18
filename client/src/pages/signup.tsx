import { useMutation } from '@tanstack/react-query';
import { type NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, type FormEvent } from 'react';
import { z } from 'zod';
import Loading from '../components/Loading';
import UserForm, { type FormState, type Field } from '../components/UserForm';
import { useAuth } from '../context/AuthContext';
import { signUp } from '../lib/auth';
import { parseSchema } from '../utils/zod';
import { isApiError } from '../types/Error';
import formatError from '../utils/formatError';
import useSignInProtection from '../hooks/useSignInProtection';

const formFields: Field[] = [
  {
    label: 'name',
    type: 'text',
  },
  {
    label: 'email',
    type: 'email',
  },
  {
    label: 'password',
    type: 'password',
  },
  {
    label: 'confirm password',
    type: 'password',
  },
];

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, {
        message: 'Name must be at least 3 characters long',
      })
      .max(15, {
        message: 'Name must be at most 15 characters long',
      }),
    email: z.string().email({
      message: 'Email field must be an email',
    }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters long',
    }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords did not match',
    path: ['confirmPassword'],
  });

const SignIn: NextPage = () => {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    name: '',
    'confirm password': '',
  });
  const [validationError, setValidationError] = useState<string>();
  const router = useRouter();
  const { user, setUser, setToken } = useAuth();

  const { mutate, error, isLoading } = useMutation({
    mutationFn: (userData: z.infer<typeof signUpSchema>) => signUp(userData),
    onSuccess: data => {
      setUser(data.user);
      setToken(data.token);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/');
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const { email, password, name } = formState;
    const userData = {
      name: name as string,
      email: email as string,
      password: password as string,
      confirmPassword: formState['confirm password'] as string,
    };

    const parseResult = parseSchema(signUpSchema, userData);

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
        <h1 className='text-4xl'>Sign up</h1>
        <p>
          Already have an account?{' '}
          <Link
            href='/signin'
            className='text-amber-600 transition-colors hover:text-amber-400 focus:outline-none focus-visible:text-amber-400'
          >
            Sign in.
          </Link>
        </p>
      </div>
      <UserForm
        formState={formState}
        setFormState={setFormState}
        handleSubmit={handleSubmit}
        fields={formFields}
        submitBtnText='Sign up'
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
