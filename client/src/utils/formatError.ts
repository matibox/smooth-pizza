import type { Error } from '../types/Error';

export default function formatError(error: Error) {
  const errors = error.response.data.errors;
  if (!errors) return error.response.data.message;
  return Object.values(errors)
    .map(err => err[0])
    .reduce((a, b) => `${a as string}. ${b as string}`);
}
