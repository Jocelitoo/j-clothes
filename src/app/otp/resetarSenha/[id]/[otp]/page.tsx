'use client';

import { resetPassword } from '@/actions/otpActions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { resetPasswordSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const NewPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { id, otp } = useParams<{ id: string; otp: string }>(); // Pega os parâmetros
  const { toast } = useToast();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    // Organizar os dados
    const formData = {
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmNewPassword,
      userId: id,
      otp: otp,
    };

    // Fazer a requisição
    setIsLoading(true);

    resetPassword(formData)
      .then((response) => {
        form.reset(); // Limpa todos os inputs
        toast({
          description: response,
          style: { backgroundColor: '#07bc0c', color: '#000' },
        });
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
    <div className="flex-grow flex items-center justify-center px-2 sm:px-4 lg:px-20 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-slate-50 border shadow-lg w-full max-w-md p-4 rounded-md space-y-4"
        >
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova senha</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar nova senha</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isLoading ? (
            <Button
              variant={'ghost'}
              type="button"
              disabled
              className="bg-cyan-300 hover:bg-cyan-500"
            >
              <Loader2 className="animate-spin" /> Alterando senha...
            </Button>
          ) : (
            <Button
              variant={'ghost'}
              type="submit"
              className="bg-cyan-300 hover:bg-cyan-500"
            >
              Alterar senha
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default NewPassword;
