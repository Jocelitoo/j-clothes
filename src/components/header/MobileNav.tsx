'use client';

import { useCartContext } from '@/hooks/CartContextProvider';
import { Menu, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import React, { useState } from 'react';
import { Loading } from '../Loading';
import { signOut } from 'next-auth/react';
import { CurrentUserProps } from '@/utils/props';

interface MobileNavProps {
  currentUser: CurrentUserProps | undefined;
  links: {
    text: string;
    link: string;
  }[];
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentUser, links }) => {
  const [isLoading, setIsLoading] = useState(false);
  const currentPage = usePathname(); // Pegar a URL
  const { cartProducts } = useCartContext(); // Pegar os produtos no carrinho

  // Somar a quantidade total de produtos no carrinho
  const totalCartProducts = cartProducts.reduce(
    (acc, cartProduct) => (acc += cartProduct.quantity),
    0,
  );

  const logout = () => {
    setIsLoading(true);

    signOut({ redirect: false })
      .then(() => {
        location.replace('/'); // Redireciona para a home e atualiza a página para aplicar as alterações de usuário deslogado
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && <Loading loadingText="Saindo..." />}

      <div className="flex items-center gap-4 lg:hidden">
        <Link href={'/carrinho'} className="relative">
          <ShoppingBag className="hover:fill-cyan-300" />

          {totalCartProducts >= 1 && (
            <span className="absolute -top-3 -right-4 flex items-center justify-center bg-red-500 size-5 rounded-full text-white text-xs ">
              {totalCartProducts >= 99 ? 99 : totalCartProducts}
              {/* Só mostra até 99 */}
            </span>
          )}
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant={'ghost'} className="p-2">
              <Menu className="!size-8" />
              <span className="sr-only">Barra de navegação</span>
            </Button>
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>Navegação</SheetTitle>
            </SheetHeader>

            <nav className="mt-4">
              <ul className="space-y-4">
                {links.map((link, index) => {
                  return (
                    <li key={index}>
                      <SheetClose asChild>
                        <Link
                          href={link.link}
                          className={`p-2 rounded-md inline-block w-full ${currentPage === link.link ? 'bg-cyan-300' : 'bg-slate-200'}`}
                        >
                          {link.text}
                        </Link>
                      </SheetClose>
                    </li>
                  );
                })}

                {currentUser && (
                  <>
                    <li>
                      <SheetClose asChild>
                        <Link
                          href={`/pedidos/${currentUser.id}`}
                          className={`p-2 rounded-md inline-block w-full ${currentPage === '/config' ? 'bg-cyan-300' : 'bg-slate-200'}`}
                        >
                          Seus pedidos
                        </Link>
                      </SheetClose>
                    </li>

                    <li>
                      <SheetClose asChild>
                        <Link
                          href={`/config/${currentUser.id}`}
                          className={`p-2 rounded-md inline-block w-full ${currentPage === `/config/${currentUser.id}` ? 'bg-cyan-300' : 'bg-slate-200'}`}
                        >
                          Configurações
                        </Link>
                      </SheetClose>
                    </li>

                    {currentUser.role === 'Admin' && (
                      <li>
                        <SheetClose asChild>
                          <Link
                            href={'/admin'}
                            className={`p-2 rounded-md inline-block w-full ${currentPage === '/admin' ? 'bg-cyan-300' : 'bg-slate-200'}`}
                          >
                            Painel de administração
                          </Link>
                        </SheetClose>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </nav>

            <Separator className="my-4" />

            {currentUser ? (
              <SheetClose asChild>
                <Button
                  variant={'ghost'}
                  onClick={() => logout()}
                  className="w-full bg-cyan-300 duration-300 hover:bg-cyan-500"
                >
                  Sair
                </Button>
              </SheetClose>
            ) : (
              <SheetClose asChild>
                <Link
                  href={'/login'}
                  className="bg-cyan-300 inline-block w-full py-2 text-center rounded-md font-semibold transition-colors duration-300 hover:bg-cyan-500"
                >
                  Login
                </Link>
              </SheetClose>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
