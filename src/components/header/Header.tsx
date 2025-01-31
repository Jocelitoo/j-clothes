'use client';

import Link from 'next/link';
import { MobileNav } from './MobileNav';
import { DesktopNav } from './DesktopNav';
import { useCurrentUserContext } from '@/hooks/CurrentUserContextProvider';

// Listar os links de navegação
const links = [
  {
    text: 'Início',
    link: '/',
  },
  {
    text: 'Produtos',
    link: '/produtos',
  },
  {
    text: 'Homem',
    link: '/produtos/homem',
  },
  {
    text: 'Mulher',
    link: '/produtos/mulher',
  },
  {
    text: 'Calçado',
    link: '/produtos/calçado',
  },
];

export const Header = () => {
  // const [isLoading, setIsLoading] = useState(true);
  // const [currentUser, setCurrentUser] = useState();
  const { currentUser } = useCurrentUserContext(); // Pegar os dados do usuário logado

  // const getCurrentUser = async () => {
  //   const session = await getSession(); // Pegar a session
  //   const currentUser = session?.user; // Pegar os dados do usuário logado que vem na session
  //   setCurrentUser(currentUser);
  // };

  // // Código executado 1 vez quando a página é carregada
  // useEffect(() => {
  //   getCurrentUser().finally(() => setIsLoading(false));
  // }, []);

  // if (isLoading) return <Loading loadingText="Carregando" />;

  return (
    <header className="py-2 px-2 sm:px-4 lg:px-20 fixed left-0 top-0 right-0 z-50 flex justify-between items-center bg-slate-200 ">
      <Link href={'/'} className="font-semibold uppercase">
        J-Clothes
      </Link>

      <MobileNav currentUser={currentUser} links={links} />
      <DesktopNav currentUser={currentUser} links={links} />
    </header>
  );
};
