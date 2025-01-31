'use client';

import { useCartContext } from '@/hooks/CartContextProvider';
import { ChevronDown, ShoppingBag, User2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { signOut } from 'next-auth/react';
import { Loading } from '../Loading';
import { CurrentUserProps } from '@/utils/props';

interface DesktopNavProps {
  currentUser: CurrentUserProps | undefined;
  links: {
    text: string;
    link: string;
  }[];
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  currentUser,
  links,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const currentPage = usePathname(); // Pegar a URL
  const router = useRouter(); // Navegar entre páginas
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

      <nav className="hidden items-center lg:flex">
        <ul className="flex gap-4">
          {links.map((link, index) => {
            return (
              <li key={index}>
                <Link
                  href={link.link}
                  className={`inline-block py-2 px-4 rounded-md  ${currentPage === link.link && 'bg-cyan-300'} duration-300 hover:bg-cyan-300`}
                >
                  {link.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hidden items-center gap-6 lg:flex">
        <Link href={'/carrinho'} className="relative">
          <ShoppingBag className="hover:fill-cyan-300" />

          {totalCartProducts >= 1 && (
            <span className="absolute -top-3 -right-4 flex items-center justify-center bg-red-500 size-5 rounded-full text-white text-xs ">
              {totalCartProducts >= 99 ? 99 : totalCartProducts}
              {/* Só mostra até 99 */}
            </span>
          )}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-transparent border border-black rounded-full !px-2 duration-300 gap-0">
              <User2 className="text-black !size-6" />
              <ChevronDown className="text-black !size-6" />
              <span className="sr-only">Abrir opções do perfil</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            {currentUser ? (
              <>
                <DropdownMenuItem
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') router.push('/orders');
                  }}
                  className="p-0"
                >
                  <Link
                    href={`/pedidos/${currentUser.id}`}
                    className="w-full rounded-md p-2 duration-300 hover:bg-cyan-300"
                  >
                    Seus pedidos
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onKeyDown={(event) => {
                    if (event.key === 'Enter')
                      router.push(`/config/${currentUser.id}`);
                  }}
                  className="p-0"
                >
                  <Link
                    href={`/config/${currentUser.id}`}
                    className="w-full rounded-md p-2 duration-300 hover:bg-cyan-300"
                  >
                    Configurações
                  </Link>
                </DropdownMenuItem>

                {currentUser.role === 'Admin' && (
                  <DropdownMenuItem
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') router.push('/admin');
                    }}
                    className="p-0"
                  >
                    <Link
                      href={'/admin'}
                      className="w-full rounded-md p-2 duration-300 hover:bg-cyan-300"
                    >
                      Painel de administração
                    </Link>
                  </DropdownMenuItem>
                )}

                <Separator className="my-2" />

                <DropdownMenuItem
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') console.log('oi');
                  }}
                >
                  <Button
                    variant={'ghost'}
                    onClick={() => logout()}
                    className="bg-cyan-300 w-full duration-300 hover:bg-cyan-500"
                  >
                    Sair
                  </Button>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') router.push('/login');
                  }}
                  className="p-0"
                >
                  <Link
                    href={'/login'}
                    className="w-full rounded-md p-2 duration-300 hover:bg-cyan-300"
                  >
                    Login
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') router.push('/register');
                  }}
                  className="p-0"
                >
                  <Link
                    href={'/registro'}
                    className="w-full rounded-md p-2 duration-300 hover:bg-cyan-300"
                  >
                    Registrar-se
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
