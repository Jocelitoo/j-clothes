'use client';

import { Button } from '@/components/ui/button';
import { useCartContext } from '@/hooks/CartContextProvider';
import { useToast } from '@/hooks/use-toast';
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CheckoutFormProps {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  handleSetPaymentSuccess,
}) => {
  const { cartProducts, setCartProducts, handleSetPaymentIntent } =
    useCartContext();
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const total = cartProducts
    .reduce((acc, product) => acc + product.price * product.quantity, 0)
    .toFixed(2);

  useEffect(() => {
    if (!stripe || clientSecret) return;

    handleSetPaymentSuccess(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe, clientSecret]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    stripe
      .confirmPayment({ elements, redirect: 'if_required' })
      .then((response) => {
        if (!response.error) {
          toast({
            description: 'Sucesso',
            style: { backgroundColor: '#07bc0c', color: '#000' },
          });

          // Limpar o carrinho
          sessionStorage.setItem('cart', JSON.stringify([]));
          setCartProducts([]);

          handleSetPaymentSuccess(true);
          handleSetPaymentIntent(null);
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="px-2 md:px-4 lg:px-20 my-8 lg:my-16 ">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg mx-auto border rounded-md p-4 bg-slate-100 shadow-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Insira seus dados</h1>

        <div className="space-y-3">
          <h2 className="font-semibold">Endereço:</h2>
          <AddressElement
            options={{ mode: 'shipping', allowedCountries: ['BR'] }}
          />
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold">Informações de pagamento</h2>
          <PaymentElement options={{ layout: 'tabs' }} />
        </div>

        <p className="text-center text-xl font-bold">Total: R${total}</p>

        {isLoading ? (
          <Button
            variant={'ghost'}
            disabled
            className="w-full space-x-1 bg-cyan-300 transition-colors
            duration-300 hover:bg-cyan-500"
          >
            <Loader2 className="animate-spin" />
            <span>Processando...</span>
          </Button>
        ) : (
          <Button
            variant={'ghost'}
            type="submit"
            disabled={!stripe || !elements || cartProducts.length === 0}
            className="w-full bg-cyan-300 transition-colors
            duration-300 hover:bg-cyan-500"
          >
            Pagar
          </Button>
        )}
      </form>
    </div>
  );
};
