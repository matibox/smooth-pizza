import type { User } from '../types/User';
import api, { sanctum } from '../utils/axios';

export async function signUp({
  name,
  email,
  password,
  confirmPassword,
}: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  return await sanctum.get('csrf-cookie').then(async () => {
    return await api
      .post<{ user: User; token: string }>('register', {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      })
      .then(res => res.data);
  });
}
