'use client';

import { updateUserPassword } from '@/actions/configActions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { newPasswordFormSchema } from '@/lib/schema';
import { CurrentUserProps } from '@/utils/props';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface NewPasswordFormProps {
  user: CurrentUserProps | null;
}

export const NewPasswordForm: React.FC<NewPasswordFormProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof newPasswordFormSchema>>({
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = (values: z.infer<typeof newPasswordFormSchema>) => {
    // Verificar se é possível pegar o id do usuário logado
    if (!user?.id) return;

    // Organizar os dados
    const data = {
      id: user.id,
      password: values.password,
      newPassword: values.newPassword,
    };

    // Enviar os dados
    setIsLoading(true);

    updateUserPassword(data)
      .then((response) => {
        location.reload(); // Recarrega a página atual
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
    <Card>
      <CardHeader>
        <CardTitle>Senha</CardTitle>
        <CardDescription>Altere sua senha aqui.</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Senha atual</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-1">
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
                <FormItem className="space-y-1">
                  <FormLabel>Confirmar nova senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isLoading ? (
              <Button type="button" disabled>
                <Loader2 className="animate-spin" />
                Salvando alterações
              </Button>
            ) : (
              <Button
                variant={'ghost'}
                type="submit"
                className="bg-cyan-300 hover:bg-cyan-500"
              >
                Salvar alterações
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
