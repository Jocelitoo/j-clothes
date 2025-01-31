'use client';

import { Loading } from '@/components/Loading';
import { useCartContext } from '@/hooks/CartContextProvider';
import { useToast } from '@/hooks/use-toast';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { redirect } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from './CheckoutForm';
import { useCurrentUserContext } from '@/hooks/CurrentUserContextProvider';
import { CircleCheck } from 'lucide-react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

export const CheckoutClient = () => {
  const { cartProducts, paymentIntent, handleSetPaymentIntent } =
    useCartContext();
  const { currentUser } = useCurrentUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSucess, setPaymentSucess] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser) return redirect('/login'); // Se o usuário estiver deslogado, redireciona ele para a tela de login

    // Criar um paymentIntent no momento que a página /checkout for carregada e cartItems tiver sido recebido
    if (cartProducts && cartProducts.length > 0) {
      setIsLoading(true);
      setError(false);

      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: cartProducts,
          payment_intent_id: paymentIntent,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setClientSecret(data.paymentIntent.client_secret);
          handleSetPaymentIntent(data.paymentIntent.id);
        })
        .catch(() => {
          setError(true);

          toast({
            description: 'Alguma coisa deu errado',
            style: { backgroundColor: '#e74c3c', color: '#000' },
          });
        })
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartProducts]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      labels: 'floating',
    },
  };

  const handleSetPaymentSuccess = useCallback((value: boolean) => {
    setPaymentSucess(value);
  }, []);

  return (
    <>
      {isLoading && <Loading loadingText="Carregando..." />}

      {error && <div>Alguma coisa deu errado</div>}

      {clientSecret && cartProducts.length > 0 && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            handleSetPaymentSuccess={handleSetPaymentSuccess}
          />
        </Elements>
      )}

      {paymentSucess && (
        <div className="flex flex-grow flex-col items-center justify-center space-y-4">
          <p className="text-3xl flex items-center gap-2">
            Pagamento bem sucedido{' '}
            <CircleCheck className="size-8 fill-green-500" />
          </p>

          <a
            href={`/pedidos/${currentUser?.id}`}
            className="px-4 py-2 rounded-md bg-cyan-300 transition-colors duration-300 hover:bg-cyan-500"
          >
            Veja seus pedidos
          </a>
        </div>
      )}
    </>
  );
};
