'use client';

import { CurrentUserProps } from '@/utils/props';
import { getSession } from 'next-auth/react';
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

interface CurrentUserContextProps {
  currentUser: CurrentUserProps | undefined;
  setCurrentUser: Dispatch<SetStateAction<CurrentUserProps | undefined>>;
}

interface CurrentUserProviderProps {
  children: ReactNode;
}

const CurrentUserContext = createContext<CurrentUserContextProps | undefined>(
  undefined,
);

export const CurrentUserProvider: React.FC<CurrentUserProviderProps> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<CurrentUserProps | undefined>(
    undefined,
  );

  const getCurrentUser = async () => {
    const session = await getSession(); // Pegar a session
    const currentUser = session?.user; // Pegar os dados do usuário logado que vem na session
    setCurrentUser(currentUser);
  };

  // Código executado 1 vez quando a página é carregada
  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUserContext = () => {
  const context = useContext(CurrentUserContext);

  if (!context) {
    throw new Error(
      'useCurrentUserContext must be used within a CartContextProvider',
    );
  }

  return context;
};
