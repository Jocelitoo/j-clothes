'use client';

import { Button } from '@/components/ui/button';
import { useCartContext } from '@/hooks/CartContextProvider';
import { useCurrentUserContext } from '@/hooks/CurrentUserContextProvider';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const Checkout = () => {
  const { cartProducts, setCartProducts } = useCartContext(); // Pega os produtos no carrinho de compras
  const { currentUser } = useCurrentUserContext(); // Pega os dados do usuário logado

  const clearCart = () => {
    sessionStorage.removeItem('cart');
    setCartProducts([]); // Usamos para vermos a mudança em tempo real
  };

  const subtotal = cartProducts
    .reduce((acc, product) => (acc += product.price * product.quantity), 0)
    .toFixed(2);

  return (
    cartProducts.length !== 0 && (
      <div className="w-full flex flex-col gap-8 sm:flex-row sm:justify-between">
        <Button
          onClick={() => clearCart()}
          className="bg-red-300 text-black w-fit duration-300 hover:bg-red-500"
        >
          Limpar carrinho
        </Button>

        <div className="space-y-3">
          <div className="flex items-center justify-between font-bold">
            <p>Subtotal</p>
            <p className="text-xl">R$ {subtotal}</p>
          </div>

          <p>Taxas e valor de entrega calculados no checkout</p>

          {currentUser ? (
            <Link
              href={'/checkout'}
              className="block w-full text-center rounded-md py-2 bg-cyan-300 transition-colors duration-300 hover:bg-cyan-500"
            >
              Checkout
            </Link>
          ) : (
            <Link
              href={'/login'}
              className="block w-full text-center rounded-md py-2 bg-cyan-300 transition-colors duration-300 hover:bg-cyan-500"
            >
              Faça login
            </Link>
          )}

          <Link href="/products" className="flex items-center hover:underline">
            <ArrowLeft size={20} /> Continuar comprando
          </Link>
        </div>
      </div>
    )
  );
};
