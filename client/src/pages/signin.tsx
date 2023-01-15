import { type NextPage } from 'next';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import UserForm, { type FormState, type Field } from '../components/UserForm';

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

const SignIn: NextPage = () => {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <div className='flex h-screen w-screen flex-col justify-center gap-4 bg-orange-100 pt-[var(--navbar-height)] font-roboto-slab'>
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
    </div>
  );
};

export default SignIn;
