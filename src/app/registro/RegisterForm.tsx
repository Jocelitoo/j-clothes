'use client';

import { createUser } from '@/actions/userActions';
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
import { useCurrentUserContext } from '@/hooks/CurrentUserContextProvider';
import { useToast } from '@/hooks/use-toast';
import { registerFormSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { currentUser } = useCurrentUserContext(); // Pegar os dados do usuário logado
  if (currentUser) redirect('/'); // Redireciona o usuário logado para a home

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    setIsLoading(true);

    createUser(values)
      .then((response) => {
        toast({
          description: response,
          style: { backgroundColor: '#07bc0c', color: '#000' },
        });

        form.reset(); // Limpa todos os inputs
      })
      .catch((error) => {
        toast({
          description: error.message || 'Erro na criação do usuário',
          style: { backgroundColor: '#e74c3c', color: '#000' },
        });
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
        <h1 className="text-center font-semibold text-2xl">Criar conta</h1>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome:</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha:</FormLabel>
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
            type="submit"
            disabled
            aria-disabled
            className="w-full bg-cyan-300 duration-300 hover:bg-cyan-500"
          >
            <Loader2 className="animate-spin" /> Criando conta
          </Button>
        ) : (
          <Button
            variant={'ghost'}
            type="submit"
            className="w-full bg-cyan-300 duration-300 hover:bg-cyan-500"
          >
            Registrar-se
          </Button>
        )}

        <p className="text-center">
          Já tem uma conta?{' '}
          <Link href={'/login'} className="underline underline-offset-4">
            Login
          </Link>
        </p>
      </form>
    </Form>
  );
};
