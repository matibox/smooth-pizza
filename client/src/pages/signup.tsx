import { useMutation } from '@tanstack/react-query';
import { type NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { z } from 'zod';
import Loading from '../components/Loading';
import UserForm, { type FormState, type Field } from '../components/UserForm';
import { useAuth } from '../context/AuthContext';
import { signUp } from '../lib/auth';
import { parseSchema } from '../utils/zod';

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
    message: 'Passwords did not match.',
    path: ['confirmPassword'],
  });

const SignIn: NextPage = () => {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    name: '',
    'confirm password': '',
  });
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined
  );

  const { setUser } = useAuth();

  const { mutate, error } = useMutation({
    mutationFn: (userData: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => signUp(userData),
    onSuccess: data => {
      setUser({ ...data.user, token: data.token });
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

  useEffect(() => {
    console.log(error);
    console.log(validationError);
  }, [error, validationError]);

  return (
    <div className='flex h-screen w-screen flex-col justify-center gap-4 bg-orange-100 pt-[var(--navbar-height)] font-roboto-slab'>
      {/* <Loading isLoading={true} fullScreen /> */}
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
    </div>
  );
};

export default SignIn;
