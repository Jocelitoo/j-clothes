'use client';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useCurrentUserContext } from '@/hooks/CurrentUserContextProvider';
import { loginFormSchema } from '@/lib/schema';

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { currentUser } = useCurrentUserContext(); // Pegar os dados do usuário logado
  if (currentUser) redirect('/'); // Redireciona o usuário logado para a home

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true);

    // Fazer login
    signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    })
      .then((response) => {
        if (response?.ok) {
          location.replace('/carrinho'); // Redireciona para a página /carrinho e atualiza a página para aplicar as mudanças do usuário logado
        } else {
          toast({
            description: response?.error || 'Erro no login',
            style: { backgroundColor: '#e74c3c', color: '#000' },
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-slate-50 border space-y-4 max-w-lg mx-auto rounded-md p-4 shadow-lg"
      >
        <h1 className="text-center font-semibold text-2xl">Login</h1>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email:</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha:</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Link
          href={'/otp/resetarSenha'}
          className="underline underline-offset-4 text-sm block text-end"
        >
          Esqueceu a senha ?
        </Link>

        {isLoading ? (
          <Button
            variant={'ghost'}
            type="submit"
            disabled
            aria-disabled
            className="w-full bg-cyan-300 duration-300 hover:bg-cyan-500"
          >
            <Loader2 className="animate-spin" /> Entrando
          </Button>
        ) : (
          <Button
            variant={'ghost'}
            type="submit"
            className="w-full bg-cyan-300 duration-300 hover:bg-cyan-500"
          >
            Login
          </Button>
        )}

        <p className="text-center">
          Não tem uma conta?{' '}
          <Link href={'/registro'} className="underline underline-offset-4">
            Registrar-se
          </Link>
        </p>
      </form>
    </Form>
  );
};
