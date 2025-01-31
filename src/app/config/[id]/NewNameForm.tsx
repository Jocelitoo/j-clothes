'use client';

import { updateUserName } from '@/actions/configActions';
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
import { newNameFormSchema } from '@/lib/schema';
import { CurrentUserProps } from '@/utils/props';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface NewNameFormProps {
  user: CurrentUserProps | null;
}

export const NewNameForm: React.FC<NewNameFormProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof newNameFormSchema>>({
    resolver: zodResolver(newNameFormSchema),
    defaultValues: {
      name: user?.name,
      newName: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof newNameFormSchema>) => {
    // Verificar se é possível pegar o id do usuário logado
    if (!user?.id) return;

    // Organizar os dados
    const data = {
      id: user.id,
      newName: values.newName,
      password: values.password,
    };

    // Enviar os dados
    setIsLoading(true);

    updateUserName(data)
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
        <CardTitle>Nome</CardTitle>
        <CardDescription>
          Altere seu nome aqui. Clique em salvar alterações quando estiver
          pronto
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Nome Atual</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Novo nome</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Digite sua senha atual</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isLoading ? (
              <Button disabled>
                <Loader2 className="animate-spin" /> Salvando alterações
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
