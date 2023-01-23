import { RadioGroup } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type FormEvent, useState, type FC } from 'react';
import { z } from 'zod';
import type { ProductCategory, ProductInput } from '../types/Product';
import { parseSchema } from '../utils/zod';
import { addProduct } from '../lib/products';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';
import { isApiError } from '../types/Error';
import formatError from '../utils/formatError';

type NewProductFormProps = {
  close: () => void;
};

const availableCategories: readonly ProductCategory[] = [
  'beer',
  'cold-drinks',
  'hot-drinks',
  'pizza',
  'sauce',
  'wine',
] as const;

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
  category: z
    .string()
    .refine(category =>
      availableCategories.includes(category as ProductCategory)
    ),
});

const NewProductForm: FC<NewProductFormProps> = ({ close }) => {
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: '',
    category: availableCategories[0] as (typeof availableCategories)[number],
  });
  const [formError, setFormError] = useState<string>();
  const { user } = useAuth();

  const queryClient = useQueryClient();
  const { mutate, isLoading, error } = useMutation({
    mutationFn: ({
      product,
      token,
    }: {
      product: ProductInput;
      token: string | undefined;
    }) => addProduct(product, token),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['products']);
      close();
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const result = parseSchema(formSchema, formState);
    if (result.error) {
      setFormError(result.message);
      return;
    }

    mutate({ product: formState, token: user?.token });
  }

  return (
    <>
      <div
        className='fixed top-0 left-0 z-30 h-screen w-full bg-stone-900/50 backdrop-blur'
        onClick={close}
      />
      <div className='fixed top-1/2 left-1/2 z-50 flex w-11/12 max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col justify-between gap-4 bg-orange-100 p-6 font-roboto-slab text-stone-900 ring-2 ring-stone-50'>
        {isLoading && (
          <div className='absolute top-0 left-0 flex h-full w-full items-center justify-center bg-stone-900/50'>
            <Loading isLoading={isLoading} />
          </div>
        )}
        <button
          className='absolute top-0 right-2 text-lg transition-colors hover:text-amber-600'
          onClick={close}
        >
          x
        </button>
        <span className='text-2xl'>New product</span>
        <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
          <>
            <label className='flex flex-col gap-1'>
              <span className='text-lg capitalize'>name</span>
              <input
                type='text'
                className='px-3 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700'
                value={formState.name}
                onChange={e =>
                  setFormState(prev => ({ ...prev, name: e.target.value }))
                }
              />
            </label>
            <label className='flex flex-col gap-1'>
              <span className='text-lg capitalize'>description</span>
              <input
                type='text'
                className='px-3 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700'
                value={formState.description}
                onChange={e =>
                  setFormState(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </label>
            <label className='flex flex-col gap-1'>
              <span className='text-lg capitalize'>price</span>
              <input
                type='number'
                min={0}
                step={0.01}
                className='px-3 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700'
                value={formState.price}
                onChange={e =>
                  setFormState(prev => ({ ...prev, price: e.target.value }))
                }
              />
            </label>
            <RadioGroup
              value={formState.category}
              onChange={value =>
                setFormState(prev => ({ ...prev, category: value }))
              }
            >
              <RadioGroup.Label as='h2' className='mb-4 text-lg'>
                Category
              </RadioGroup.Label>
              <div className='flex flex-wrap gap-2'>
                {availableCategories.map(category => (
                  <RadioGroup.Option key={category} value={category}>
                    {({ checked }) => (
                      <span
                        className={`${
                          checked
                            ? 'bg-amber-500 ring-amber-500'
                            : 'bg-stone-50 ring-stone-900 hover:text-amber-500 hover:ring-amber-500'
                        } flex w-full cursor-pointer items-center justify-center px-6 py-2 text-stone-900 ring-1   transition-all sm:w-40`}
                      >
                        {category}
                      </span>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
            {error && (
              <p className='text-red-500'>
                {isApiError(error) ? formatError(error) : 'Unknown error.'}
              </p>
            )}
            {formError && <p className='text-red-500'>{formError}</p>}
            <button className='mt-6 w-48 self-end px-3 py-1 ring-1 ring-stone-900 transition-all hover:text-amber-600 hover:ring-amber-600 focus-visible:text-amber-600 focus-visible:outline-none focus-visible:ring-amber-600 md:px-4'>
              Add new product
            </button>
          </>
        </form>
      </div>
    </>
  );
};

// {
//   "name": "Wine",
//   "description": "0.85l",
//   "price": "2.00",
//   "category": "hot-drinks"
// }

export default NewProductForm;
