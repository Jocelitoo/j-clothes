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
  const { currentUser } = useCurrentUserContext(); // Pegar os dados do usuário logado

  return (
    <header className="py-2 px-2 sm:px-4 lg:px-20 sticky left-0 top-0 right-0 z-50 flex justify-between items-center bg-slate-200 ">
      <Link
        href={'/'}
        aria-label="Ir para a página inicial"
        className="font-semibold uppercase"
      >
        J-Clothes
      </Link>

      <MobileNav currentUser={currentUser} links={links} />
      <DesktopNav currentUser={currentUser} links={links} />
    </header>
  );
};
