import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '../types/User';

type AuthCtxUser = (User & { token: string }) | undefined;

type AuthContext = {
  user: AuthCtxUser;
  setUser: Dispatch<SetStateAction<AuthCtxUser>>;
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
  const [user, setUser] = useState<AuthCtxUser>(undefined);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
