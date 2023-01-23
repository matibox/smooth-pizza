import { useMutation } from '@tanstack/react-query';
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
  type ReactNode,
  useEffect,
  useMemo,
} from 'react';
import { getUserByToken } from '../lib/auth';
import { isApiError } from '../types/Error';
import type { User } from '../types/User';
import formatError from '../utils/formatError';

type AuthContext = {
  user: (User & { token: string }) | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  setToken: (token: string | undefined) => void;
  isLoading: boolean;
} | null;

const AuthContext = createContext<AuthContext>(null);

export function useAuth() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('Context consumer must be in a context provider');
  }
  return authContext;
}

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [loading, setLoading] = useState(true);

  const authUser = useMemo(() => {
    if (token) {
      return {
        ...(user as User),
        token,
      };
    }
    return undefined;
  }, [user, token]);

  const { mutate } = useMutation({
    mutationFn: (token: string) => getUserByToken(token),
    onSuccess: res => {
      setUser(res);
    },
    onError: err => {
      if (isApiError(err)) {
        const error = formatError(err);
        if (error?.includes('Unauthenticated')) {
          setLocalToken(undefined);
        }
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    const storageToken = localStorage.getItem('token');
    if (!storageToken) return setLoading(false);
    setToken(storageToken);
    mutate(storageToken);
  }, [mutate]);

  const setLocalToken = (token: string | undefined) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    setToken(token);
  };

  return (
    <AuthContext.Provider
      value={{
        user: authUser,
        setUser,
        setToken: setLocalToken,
        isLoading: loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
