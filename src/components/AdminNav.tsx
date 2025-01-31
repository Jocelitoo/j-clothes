'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  {
    url: '/admin',
    text: 'Sumário',
  },
  {
    url: '/admin/adicionar-produtos',
    text: 'Adicionar produtos',
  },
  {
    url: '/admin/gerenciar-produtos',
    text: 'Gerenciar produtos',
  },
  {
    url: '/admin/gerenciar-pedidos',
    text: 'Gerenciar pedidos',
  },
];

export const AdminNav = () => {
  const currentPage = usePathname(); // Pegar a URL

  return (
    <nav className="md:my-4">
      <ul className="flex text-center flex-col md:flex-row md:gap-4 md:px-4 lg:px-20 md:justify-center">
        {links.map((link, index) => {
          return (
            <Link
              key={index}
              href={link.url}
              className={`w-full py-2 border-b-2 border-black ${link.url === currentPage && 'bg-cyan-300'} transition-colors duration-300 hover:bg-cyan-300 md:border-0 md:w-fit md:px-4 md:rounded-md`}
            >
              {link.text}
            </Link>
          );
        })}
      </ul>
    </nav>
  );
};
