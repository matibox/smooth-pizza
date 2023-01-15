import type {
  FormEvent,
  HTMLInputTypeAttribute,
  FC,
  Dispatch,
  SetStateAction,
} from 'react';

export type Field = {
  label: 'email' | 'password' | 'name';
  type: HTMLInputTypeAttribute;
};

export type FormState = Partial<Record<Field['label'], string>>;

type UserFormProps = {
  handleSubmit: (e: FormEvent) => void;
  fields: Field[];
  formState: FormState;
  setFormState: Dispatch<SetStateAction<FormState>>;
  submitBtnText: string;
};

const UserForm: FC<UserFormProps> = ({
  handleSubmit,
  fields,
  formState,
  setFormState,
  submitBtnText,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto flex w-3/4 max-w-lg flex-col gap-2'
    >
      {fields.map(field => (
        <label key={field.label} className='flex flex-col gap-1'>
          <span className='text-lg capitalize'>{field.label}</span>
          <input
            type={field.type}
            value={formState[`${field.label}`]}
            onChange={e =>
              setFormState(prev => ({
                ...prev,
                [`${field.label}`]: e.target.value,
              }))
            }
            className='px-3 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700'
          />
        </label>
      ))}
      <button className='my-8 px-4 py-1 ring-1 ring-stone-900 transition-all hover:text-amber-700 hover:ring-amber-700 focus-visible:text-amber-700 focus-visible:outline-none focus-visible:ring-amber-700'>
        {submitBtnText}
      </button>
    </form>
  );
};

export default UserForm;
