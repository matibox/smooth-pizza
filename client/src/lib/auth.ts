import type { User } from '../types/User';
import api, { sanctum } from '../utils/axios';

async function getCsrf() {
  return await sanctum.get('csrf-cookie');
}

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
  return await getCsrf().then(async () => {
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

export async function getUserByToken(token: string) {
  return await getCsrf().then(async () => {
    return await api
      .get<User>('user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => res.data);
  });
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  return await getCsrf().then(async () => {
    return await api
      .post<{ user: User; token: string }>('login', {
        email,
        password,
      })
      .then(res => res.data);
  });
}

export async function signOut(token: string) {
  return await api.post<{message: string}>('logout', undefined, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}