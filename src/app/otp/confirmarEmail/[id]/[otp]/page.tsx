'use client';

import { verifyEmail } from '@/actions/otpActions';
import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const ConfirmEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { id, otp } = useParams<{ id: string; otp: string }>(); // Pega os parâmetros
  const { toast } = useToast();

  const handlerVerifyEmail = () => {
    setIsLoading(true);

    verifyEmail(id, otp)
      .then(() => {
        location.replace('/login'); // Direciona o usuário pro login
      })
      .catch((error) => {
        toast({
          description: error.message,
          style: { backgroundColor: '#e74c3c', color: '#000' },
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {isLoading && <Loading loadingText="Validando email..." />}

      <div className="flex-grow flex justify-center items-center ">
        <Button
          type="button"
          className="bg-green-300 text-black text-1xl hover:bg-green-500"
          onClick={() => handlerVerifyEmail()}
        >
          Clique aqui para verificar seu email
        </Button>
      </div>
    </>
  );
};

export default ConfirmEmail;
