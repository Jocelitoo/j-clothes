'use client';

import { sendOTPResetPassword } from '@/actions/emailSender';
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
import { emailResetPasswordSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof emailResetPasswordSchema>>({
    resolver: zodResolver(emailResetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (values: z.infer<typeof emailResetPasswordSchema>) => {
    setIsLoading(true);

    sendOTPResetPassword(values.email)
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
          className="bg-slate-50 border shadow-lg max-w-lg p-4 rounded-md space-y-4"
        >
          <p className="text-xl">
            Digite o email da conta para ser enviado um email de alteração de
            senha
          </p>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
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
              <Loader2 className="animate-spin" /> Enviando email
            </Button>
          ) : (
            <Button
              variant={'ghost'}
              type="submit"
              className="bg-cyan-300 hover:bg-cyan-500"
            >
              Enviar email
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
