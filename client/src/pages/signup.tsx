import { type NextPage } from 'next';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import Loading from '../components/Loading';
import UserForm, { type FormState, type Field } from '../components/UserForm';

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
];

const SignIn: NextPage = () => {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    name: '',
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <div className='flex h-screen w-screen flex-col justify-center gap-4 bg-orange-100 pt-[var(--navbar-height)] font-roboto-slab'>
      <Loading isLoading={true} fullScreen />
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
