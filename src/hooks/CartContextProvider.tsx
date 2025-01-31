'use client';

import { CartProductProps } from '@/utils/props';
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface CartContextProps {
  cartProducts: CartProductProps[];
  setCartProducts: Dispatch<SetStateAction<CartProductProps[]>>;
  paymentIntent: string | null;
  handleSetPaymentIntent: (val: string | null) => void;
}

interface CartContextProvider {
  children: ReactNode;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartContextProvider: React.FC<CartContextProvider> = ({
  children,
}) => {
  const [cartProducts, setCartProducts] = useState<CartProductProps[]>([]);
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  // Código executado 1 vez quando a página é carregada
  useEffect(() => {
    // Next.js renderiza no lado do servidor e do cliente. sessionStorage só existe no lado do cliente, como o Next.js começa a renderizar no lado do servidor onde sessionStorage n existe, pode dar erro no programa, por isso o if()
    if (typeof window !== 'undefined') {
      const storedCartProducts = sessionStorage.getItem('cart');
      setCartProducts(storedCartProducts ? JSON.parse(storedCartProducts) : []);

      const jClothesPaymentIntent = sessionStorage.getItem(
        'jClothesPaymentIntent',
      );
      if (jClothesPaymentIntent) {
        const paymentIntent: string = JSON.parse(jClothesPaymentIntent);
        setPaymentIntent(paymentIntent);
      }
    }
  }, []);

  const handleSetPaymentIntent = useCallback((val: string | null) => {
    setPaymentIntent(val);
    sessionStorage.setItem('jClothesPaymentIntent', JSON.stringify(val));
  }, []);

  // Código executado 1 vez quando a página é carregada e toda vez que cartItems sofrer alguma alteração
  // useEffect(() => {
  //   cartProducts.map((cartProduct) => {
  //     // Verificar se algum item do carrinho tem quantidade igual a 0 ou menor
  //     if (cartProduct.quantity <= 0) {
  //       setCartProducts((prevCartProducts) => {
  //         // Remover do array o item que tem o mesmo id do item com quantidade 0 ou menor
  //         const updatedCartProducts = prevCartProducts.filter(
  //           (prevCartProduct) => prevCartProduct.id !== cartProduct.id,
  //         );

  //         // Salva os dados na session storage que são os dados que ficam salvos enquanto a página estiver aberta. Assim n precisamos gastar requisições ao backend nem salvar por longos períodos de tempo no localStorage
  //         sessionStorage.setItem(`cart`, JSON.stringify(updatedCartProducts));
  //         return updatedCartProducts;
  //       });
  //     }
  //   });
  // }, [cartProducts]);

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        paymentIntent,
        handleSetPaymentIntent,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCartContext must be used within a CartContextProvider');
  }

  return context;
};
